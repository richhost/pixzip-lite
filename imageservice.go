package main

import (
	"archive/zip"
	"fmt"
	"image"
	_ "image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"changeme/engine"

	_ "golang.org/x/image/webp"

	"github.com/disintegration/imaging"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type ImageItem struct {
	ID     string `json:"id"`
	Path   string `json:"path"`
	Name   string `json:"name"`
	Size   int64  `json:"size"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Format string `json:"format"`
	IsDir  bool   `json:"isDir"`
}

type CompressTask struct {
	ID             string `json:"id"`
	SpaceID        string `json:"spaceId"`
	InputPath      string `json:"inputPath"`
	OutputDir      string `json:"outputDir"`
	OriginalOutput bool   `json:"originalOutput"`
	Suffix         string `json:"suffix"`
	Format         string `json:"format"`     // "original", "webp", "avif", "jpeg", "png"
	Quality        int    `json:"quality"`    // 10 - 100
	ResizeMode     string `json:"resizeMode"` // "none", "width", "height", "scale", "fit"
	Width          int    `json:"width"`
	Height         int    `json:"height"`
	Scale          int    `json:"scale"`
	KeepExif       bool   `json:"keepExif"`
}

type CompressResult struct {
	ID               string `json:"id"`
	Success          bool   `json:"success"`
	Error            string `json:"error,omitempty"`
	InputPath        string `json:"inputPath"`
	OutputPath       string `json:"outputPath"`
	OriginalSize     int64  `json:"originalSize"`
	CompressedSize   int64  `json:"compressedSize"`
	OriginalWidth    int    `json:"originalWidth"`
	OriginalHeight   int    `json:"originalHeight"`
	CompressedWidth  int    `json:"compressedWidth"`
	CompressedHeight int    `json:"compressedHeight"`
	TargetFormat     string `json:"targetFormat"`
	DurationMs       int64  `json:"durationMs"`
}

type ImageService struct{}

func NewImageService() *ImageService {
	return &ImageService{}
}

// SelectFiles prompts user to select image files
func (s *ImageService) SelectFiles() ([]string, error) {
	app := application.Get()
	if app == nil {
		return nil, fmt.Errorf("application not ready")
	}

	dialog := app.Dialog.OpenFile().
		SetTitle("选择要压缩的图片").
		CanChooseFiles(true).
		CanChooseDirectories(false).
		AllowsOtherFileTypes(true).
		AddFilter("Image Files", "*.jpg;*.jpeg;*.png;*.webp;*.avif;*.gif;*.heic")

	paths, err := dialog.PromptForMultipleSelection()
	log.Printf("[SelectFiles] dialog returned %d paths: %v (err: %v)", len(paths), paths, err)
	return paths, err
}

// SelectDirectory prompts user to select a folder
func (s *ImageService) SelectDirectory() (string, error) {
	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("application not ready")
	}

	dialog := app.Dialog.OpenFile().
		SetTitle("选择输出文件夹").
		CanChooseFiles(false).
		CanChooseDirectories(true)

	dir, err := dialog.PromptForSingleSelection()
	log.Printf("[SelectDirectory] dialog returned: %s (err: %v)", dir, err)
	return dir, err
}

var supportedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
	".avif": true,
	".gif":  true,
	".heic": true,
}

func isImageFile(path string) bool {
	ext := strings.ToLower(filepath.Ext(path))
	return supportedExtensions[ext]
}

// ScanFiles scans given file paths or directory paths and returns valid ImageItem list
func (s *ImageService) ScanFiles(paths []string) ([]ImageItem, error) {
	log.Printf("[ScanFiles] incoming %d paths: %v", len(paths), paths)
	var items []ImageItem
	seen := make(map[string]bool)

	for _, p := range paths {
		info, err := os.Stat(p)
		if err != nil {
			log.Printf("[ScanFiles] Stat failed for %s: %v", p, err)
			continue
		}

		if info.IsDir() {
			_ = filepath.Walk(p, func(subPath string, subInfo os.FileInfo, walkErr error) error {
				if walkErr != nil || subInfo.IsDir() {
					return nil
				}
				if isImageFile(subPath) && !seen[subPath] {
					seen[subPath] = true
					if item := parseImageItem(subPath, subInfo); item != nil {
						items = append(items, *item)
					}
				}
				return nil
			})
		} else {
			if isImageFile(p) && !seen[p] {
				seen[p] = true
				if item := parseImageItem(p, info); item != nil {
					items = append(items, *item)
				}
			}
		}
	}

	log.Printf("[ScanFiles] successfully scanned %d image items", len(items))
	return items, nil
}

func parseImageItem(filePath string, info os.FileInfo) *ImageItem {
	w, h, format, err := readImageDimensions(filePath)
	if err != nil {
		ext := strings.TrimPrefix(strings.ToLower(filepath.Ext(filePath)), ".")
		format = ext
	}

	return &ImageItem{
		ID:     fmt.Sprintf("img-%d-%d", time.Now().UnixNano(), len(filePath)),
		Path:   filePath,
		Name:   filepath.Base(filePath),
		Size:   info.Size(),
		Width:  w,
		Height: h,
		Format: strings.ToUpper(format),
		IsDir:  info.IsDir(),
	}
}

func readImageDimensions(filePath string) (int, int, string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, 0, "", err
	}
	defer file.Close()

	var header [4]byte
	n, _ := io.ReadFull(file, header[:])
	_, _ = file.Seek(0, 0)

	if n >= 2 && header[0] == 0xff && header[1] == 0xd8 {
		cfg, jerr := jpeg.DecodeConfig(file)
		if jerr == nil {
			return cfg.Width, cfg.Height, "jpeg", nil
		}
	} else if n >= 4 && header[0] == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G' {
		cfg, perr := png.DecodeConfig(file)
		if perr == nil {
			return cfg.Width, cfg.Height, "png", nil
		}
	}

	_, _ = file.Seek(0, 0)
	cfg, fmtName, decodeErr := image.DecodeConfig(file)
	if decodeErr == nil && cfg.Width > 0 && cfg.Height > 0 {
		if fmtName == "" {
			fmtName = strings.TrimPrefix(strings.ToLower(filepath.Ext(filePath)), ".")
		}
		return cfg.Width, cfg.Height, fmtName, nil
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		return 0, 0, "", err
	}
	img, fmtName, err := engine.DecodeAny(data)
	if err != nil {
		return 0, 0, "", err
	}
	return img.Bounds().Dx(), img.Bounds().Dy(), fmtName, nil
}

// Compress executes native Go backend compression powered by engine (Jpegli, AVIF, WebP, PNG)
func (s *ImageService) Compress(task CompressTask) CompressResult {
	log.Printf("[Compress] starting task ID: %s, file: %s, format: %s, quality: %d, keepExif: %v", task.ID, task.InputPath, task.Format, task.Quality, task.KeepExif)
	res := CompressFile(task)
	log.Printf("[Compress] finished task ID: %s, success: %v, compressedSize: %d, err: %s", res.ID, res.Success, res.CompressedSize, res.Error)
	return res
}

func calculateResizeDimensions(origW, origH int, task CompressTask) (int, int) {
	if origW <= 0 || origH <= 0 {
		return origW, origH
	}

	switch task.ResizeMode {
	case "width":
		if task.Width > 0 && task.Width < origW {
			ratio := float64(task.Width) / float64(origW)
			newH := int(float64(origH)*ratio + 0.5)
			if newH < 1 {
				newH = 1
			}
			return task.Width, newH
		}
	case "height":
		if task.Height > 0 && task.Height < origH {
			ratio := float64(task.Height) / float64(origH)
			newW := int(float64(origW)*ratio + 0.5)
			if newW < 1 {
				newW = 1
			}
			return newW, task.Height
		}
	case "scale":
		if task.Scale > 0 && task.Scale < 100 {
			ratio := float64(task.Scale) / 100.0
			newW := int(float64(origW)*ratio + 0.5)
			newH := int(float64(origH)*ratio + 0.5)
			if newW < 1 {
				newW = 1
			}
			if newH < 1 {
				newH = 1
			}
			return newW, newH
		}
	case "fit":
		if task.Width > 0 && task.Height > 0 {
			ratioW := float64(task.Width) / float64(origW)
			ratioH := float64(task.Height) / float64(origH)
			ratio := ratioW
			if ratioH < ratioW {
				ratio = ratioH
			}
			if ratio < 1.0 {
				newW := int(float64(origW)*ratio + 0.5)
				newH := int(float64(origH)*ratio + 0.5)
				return newW, newH
			}
		}
	}

	return origW, origH
}

func determineTargetFormat(task CompressTask, origExt string) string {
	fmtLower := strings.ToLower(task.Format)
	if fmtLower == "original" || fmtLower == "" {
		extClean := strings.TrimPrefix(origExt, ".")
		if extClean == "jpg" {
			return "jpeg"
		}
		return extClean
	}
	if fmtLower == "jpg" {
		return "jpeg"
	}
	return fmtLower
}

func getOutputFilePath(task CompressTask, targetExt string) string {
	origDir := filepath.Dir(task.InputPath)
	origName := filepath.Base(task.InputPath)
	ext := filepath.Ext(origName)
	base := strings.TrimSuffix(origName, ext)

	outDir := origDir
	if !task.OriginalOutput && task.OutputDir != "" {
		outDir = task.OutputDir
	}

	suffix := task.Suffix
	outExt := "." + targetExt
	if targetExt == "jpeg" && (strings.ToLower(ext) == ".jpg" || strings.ToLower(task.Format) == "jpg") {
		outExt = ".jpg"
	}

	outFilename := base + suffix + outExt
	outPath := filepath.Join(outDir, outFilename)

	if outPath == task.InputPath && suffix == "" {
		outFilename = base + "-min" + outExt
		outPath = filepath.Join(outDir, outFilename)
	}

	return outPath
}

func CompressFile(task CompressTask) CompressResult {
	start := time.Now()
	res := CompressResult{
		ID:        task.ID,
		InputPath: task.InputPath,
	}

	info, err := os.Stat(task.InputPath)
	if err != nil {
		res.Error = fmt.Sprintf("文件不存在: %v", err)
		return res
	}
	res.OriginalSize = info.Size()

	srcData, err := os.ReadFile(task.InputPath)
	if err != nil {
		res.Error = fmt.Sprintf("无法读取文件: %v", err)
		return res
	}

	// 1. Decode Image
	img, origFormat, err := engine.DecodeAny(srcData)
	if err != nil {
		res.Error = fmt.Sprintf("无法解码图像: %v", err)
		return res
	}

	origW := img.Bounds().Dx()
	origH := img.Bounds().Dy()
	res.OriginalWidth = origW
	res.OriginalHeight = origH

	// 2. Resize calculations
	targetW, targetH := calculateResizeDimensions(origW, origH, task)

	origExt := strings.ToLower(filepath.Ext(task.InputPath))
	if origExt == "" {
		origExt = "." + origFormat
	}
	targetFormat := determineTargetFormat(task, origExt)
	res.TargetFormat = targetFormat

	outPath := getOutputFilePath(task, targetFormat)
	res.OutputPath = outPath

	outDir := filepath.Dir(outPath)
	if err := os.MkdirAll(outDir, 0755); err != nil {
		res.Error = fmt.Sprintf("无法创建输出目录: %v", err)
		return res
	}

	quality := task.Quality
	if quality <= 0 {
		quality = 80
	} else if quality > 100 {
		quality = 100
	}

	opts := engine.CompressionOptions{
		Format:                  targetFormat,
		Quality:                 quality,
		KeepExif:                task.KeepExif,
		JpegliProgressive:       true,
		JpegliAdaptiveQuant:     true,
		JpegliChromaSubsampling: "420",
	}

	var finalImg image.Image = img
	if targetW != origW || targetH != origH {
		finalImg = imaging.Resize(img, targetW, targetH, imaging.Lanczos)
	}

	var rawExifTiff []byte
	if task.KeepExif {
		rawExifTiff, _ = engine.ExtractRawExif(srcData)
	}

	encoded, finalW, finalH, err := engine.EncodeImage(finalImg, rawExifTiff, opts)
	if err != nil {
		res.Error = fmt.Sprintf("编码失败: %v", err)
		return res
	}

	res.CompressedWidth = finalW
	res.CompressedHeight = finalH

	tempOut := outPath + fmt.Sprintf(".tmp_%d", time.Now().UnixNano())
	if err := os.WriteFile(tempOut, encoded, 0644); err != nil {
		res.Error = fmt.Sprintf("写入文件失败: %v", err)
		return res
	}

	if err := os.Rename(tempOut, outPath); err != nil {
		_ = os.Remove(outPath)
		if err := os.Rename(tempOut, outPath); err != nil {
			if copyErr := copyFile(tempOut, outPath); copyErr != nil {
				_ = os.Remove(tempOut)
				res.Error = fmt.Sprintf("无法保存文件: %v", copyErr)
				return res
			}
			_ = os.Remove(tempOut)
		}
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		res.Error = fmt.Sprintf("无法获取输出状态: %v", err)
		return res
	}

	res.Success = true
	res.CompressedSize = fi.Size()
	res.DurationMs = time.Since(start).Milliseconds()
	return res
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func createZipArchive(files []string, targetZip string) error {
	zipFile, err := os.Create(targetZip)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	w := zip.NewWriter(zipFile)
	defer w.Close()

	nameCount := make(map[string]int)

	for _, file := range files {
		fInfo, err := os.Stat(file)
		if err != nil || fInfo.IsDir() {
			continue
		}

		base := filepath.Base(file)
		if cnt, exists := nameCount[base]; exists {
			ext := filepath.Ext(base)
			raw := strings.TrimSuffix(base, ext)
			base = fmt.Sprintf("%s (%d)%s", raw, cnt, ext)
			nameCount[base] = cnt + 1
		} else {
			nameCount[base] = 1
		}

		f, err := os.Open(file)
		if err != nil {
			continue
		}

		writer, err := w.Create(base)
		if err == nil {
			_, _ = io.Copy(writer, f)
		}
		f.Close()
	}

	return nil
}

// ExportZip creates a zip archive of the specified files
func (s *ImageService) ExportZip(files []string, defaultName string) (string, error) {
	if len(files) == 0 {
		return "", fmt.Errorf("没有可导出的文件")
	}

	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("application not ready")
	}

	if defaultName == "" {
		defaultName = fmt.Sprintf("PixZip_%s.zip", time.Now().Format("2006-01-02_150405"))
	}

	saveDialog := app.Dialog.SaveFile().
		SetMessage("导出压缩图包").
		SetFilename(defaultName).
		AddFilter("ZIP Archive", "*.zip")

	targetPath, err := saveDialog.PromptForSingleSelection()
	if err != nil || targetPath == "" {
		return "", err
	}

	if !strings.HasSuffix(strings.ToLower(targetPath), ".zip") {
		targetPath += ".zip"
	}

	err = createZipArchive(files, targetPath)
	if err != nil {
		return "", err
	}

	return targetPath, nil
}

// RevealInFinder reveals the target path in Finder or File Explorer
func (s *ImageService) RevealInFinder(targetPath string) error {
	if targetPath == "" {
		return fmt.Errorf("路径为空")
	}

	switch runtime.GOOS {
	case "darwin":
		return exec.Command("open", "-R", targetPath).Start()
	case "windows":
		return exec.Command("explorer.exe", "/select,", filepath.Clean(targetPath)).Start()
	default:
		return exec.Command("xdg-open", filepath.Dir(targetPath)).Start()
	}
}

// GetSampleImage writes sample-dog.jpg to temp folder and returns its ImageItem
func (s *ImageService) GetSampleImage() (ImageItem, error) {
	tempSample := filepath.Join(os.TempDir(), "pixzip_sample_dog.jpg")

	// 1. Try reading from embedded assets
	data, err := assets.ReadFile("frontend/dist/sample-dog.jpg")
	if err == nil && len(data) > 0 {
		_ = os.WriteFile(tempSample, data, 0644)
	} else {
		// 2. Fallback to filesystem
		srcPath := filepath.Join("frontend", "public", "sample-dog.jpg")
		if _, err := os.Stat(srcPath); err == nil {
			_ = copyFile(srcPath, tempSample)
		}
	}

	info, err := os.Stat(tempSample)
	if err != nil {
		return ImageItem{}, fmt.Errorf("示例图片未就绪: %v", err)
	}

	item := parseImageItem(tempSample, info)
	if item == nil {
		return ImageItem{}, fmt.Errorf("解析示例图片失败")
	}
	return *item, nil
}
