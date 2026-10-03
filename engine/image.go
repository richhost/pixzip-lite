package engine

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	_ "image/gif"
	"image/jpeg"
	"image/png"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/gen2brain/avif"
	"github.com/gen2brain/jpegli"
	"github.com/gen2brain/webp"
)

// Supported output formats
const (
	FormatJPEG = "jpeg"
	FormatAVIF = "avif"
	FormatWebP = "webp"
	FormatPNG  = "png"
)

// ResizeMode defines scaling behavior
type ResizeMode string

const (
	ResizeNone    ResizeMode = "original"
	ResizeWidth   ResizeMode = "width"
	ResizeHeight  ResizeMode = "height"
	ResizePercent ResizeMode = "percent"
	ResizeFit     ResizeMode = "fit"
	ResizeExact   ResizeMode = "exact"
)

// CompressionOptions holds settings for single/batch processing
type CompressionOptions struct {
	Format       string     `json:"format"`       // "jpeg" (jpegli), "avif", "webp", "png"
	Quality      int        `json:"quality"`      // 1-100 (default: 80)
	KeepExif     bool       `json:"keepExif"`     // true to preserve EXIF, false to strip
	ResizeMode   ResizeMode `json:"resizeMode"`   // "original", "width", "height", "percent"
	TargetWidth  int        `json:"targetWidth"`  // used when resizeMode == "width"
	TargetHeight int        `json:"targetHeight"` // used when resizeMode == "height"
	ScalePercent int        `json:"scalePercent"` // used when resizeMode == "percent" (1-100)

	// JPEGli advanced options
	JpegliChromaSubsampling string `json:"jpegliChromaSubsampling,omitempty"` // "420", "422", "444"
	JpegliProgressive       bool   `json:"jpegliProgressive,omitempty"`       // enable progressive JPEG
	JpegliAdaptiveQuant     bool   `json:"jpegliAdaptiveQuant,omitempty"`     // adaptive quantization
}

// DecodeAny attempts to decode JPEG, PNG, WebP, AVIF, GIF
func DecodeAny(data []byte) (image.Image, string, error) {
	// 1. Try AVIF if magic matches
	if len(data) >= 12 && string(data[4:8]) == "ftyp" {
		img, err := avif.Decode(bytes.NewReader(data), avif.Options{AutoRotate: true})
		if err == nil {
			return img, FormatAVIF, nil
		}
	}

	// 2. Try WebP if RIFF...WEBP
	if len(data) >= 12 && string(data[0:4]) == "RIFF" && string(data[8:12]) == "WEBP" {
		img, err := webp.Decode(bytes.NewReader(data))
		if err == nil {
			return img, FormatWebP, nil
		}
	}

	// 3. Try standard image.Decode (handles JPEG, PNG, GIF)
	img, format, err := image.Decode(bytes.NewReader(data))
	if err == nil {
		if format == "jpeg" {
			// Also auto-rotate if JPEG EXIF has orientation
			if rawTiff, err := extractJPEGExif(data); err == nil {
				info := ParseExifInfo(rawTiff)
				if info.Orientation > 1 {
					img = orientImage(img, info.Orientation)
				}
			}
		}
		return img, format, nil
	}

	// 4. Try Jpegli decoder as fallback
	img, err = jpegli.Decode(bytes.NewReader(data))
	if err == nil {
		return img, FormatJPEG, nil
	}

	return nil, "", fmt.Errorf("unable to decode image: %w", err)
}

func orientImage(img image.Image, orientation int) image.Image {
	switch orientation {
	case 2:
		return imaging.FlipH(img)
	case 3:
		return imaging.Rotate180(img)
	case 4:
		return imaging.FlipV(img)
	case 5:
		return imaging.Transpose(img)
	case 6:
		return imaging.Rotate270(img)
	case 7:
		return imaging.Transverse(img)
	case 8:
		return imaging.Rotate90(img)
	default:
		return img
	}
}

func checkHasAlpha(img image.Image) bool {
	switch img.(type) {
	case *image.NRGBA, *image.RGBA:
		bounds := img.Bounds()
		// Sample a few pixels for non-opaque alpha
		stepX := max(1, bounds.Dx()/20)
		stepY := max(1, bounds.Dy()/20)
		for y := bounds.Min.Y; y < bounds.Max.Y; y += stepY {
			for x := bounds.Min.X; x < bounds.Max.X; x += stepX {
				_, _, _, a := img.At(x, y).RGBA()
				if a < 0xFFFF {
					return true
				}
			}
		}
	}
	return false
}

// ResizeImage applies scaling according to options
func ResizeImage(img image.Image, opts *CompressionOptions) image.Image {
	bounds := img.Bounds()
	w, h := bounds.Dx(), bounds.Dy()

	switch opts.ResizeMode {
	case ResizeWidth:
		if opts.TargetWidth > 0 && opts.TargetWidth != w {
			return imaging.Resize(img, opts.TargetWidth, 0, imaging.Lanczos)
		}
	case ResizeHeight:
		if opts.TargetHeight > 0 && opts.TargetHeight != h {
			return imaging.Resize(img, 0, opts.TargetHeight, imaging.Lanczos)
		}
	case ResizePercent:
		if opts.ScalePercent > 0 && opts.ScalePercent != 100 {
			targetW := max(1, (w*opts.ScalePercent)/100)
			targetH := max(1, (h*opts.ScalePercent)/100)
			return imaging.Resize(img, targetW, targetH, imaging.Lanczos)
		}
	case ResizeFit:
		if opts.TargetWidth > 0 && opts.TargetHeight > 0 {
			ratioW := float64(opts.TargetWidth) / float64(w)
			ratioH := float64(opts.TargetHeight) / float64(h)
			ratio := ratioW
			if ratioH < ratioW {
				ratio = ratioH
			}
			if ratio < 1.0 {
				newW := int(float64(w)*ratio + 0.5)
				newH := int(float64(h)*ratio + 0.5)
				return imaging.Resize(img, newW, newH, imaging.Lanczos)
			}
		}
	case ResizeExact:
		if opts.TargetWidth > 0 && opts.TargetHeight > 0 && (opts.TargetWidth != w || opts.TargetHeight != h) {
			return imaging.Resize(img, opts.TargetWidth, opts.TargetHeight, imaging.Lanczos)
		}
	}
	return img
}

// CompressData compresses memory buffer and returns processed bytes
func CompressData(srcData []byte, opts CompressionOptions) ([]byte, int, int, error) {
	img, _, err := DecodeAny(srcData)
	if err != nil {
		return nil, 0, 0, fmt.Errorf("decode failed: %w", err)
	}

	// 1. Resize if required
	img = ResizeImage(img, &opts)

	// 2. Extract source EXIF if keepExif is requested
	var rawTiff []byte
	if opts.KeepExif {
		rawTiff, _ = ExtractRawExif(srcData)
	}

	return EncodeImage(img, rawTiff, opts)
}

// EncodeImage encodes image.Image to target format with options and EXIF injection/stripping
func EncodeImage(img image.Image, rawTiff []byte, opts CompressionOptions) ([]byte, int, int, error) {
	bounds := img.Bounds()
	outW, outH := bounds.Dx(), bounds.Dy()
	hasAlpha := checkHasAlpha(img)

	targetFmt := strings.ToLower(opts.Format)
	if targetFmt == "jpg" {
		targetFmt = FormatJPEG
	}

	quality := opts.Quality
	if quality <= 0 {
		quality = 80
	} else if quality > 100 {
		quality = 100
	}

	var encoded []byte

	switch targetFmt {
	case FormatJPEG:
		// Jpegli encoding
		jpegOpts := &jpegli.EncodingOptions{
			Quality:              quality,
			ProgressiveLevel:     2,
			AdaptiveQuantization: true,
			OptimizeCoding:       true,
		}
		if opts.JpegliChromaSubsampling == "444" {
			jpegOpts.ChromaSubsampling = image.YCbCrSubsampleRatio444
		} else if opts.JpegliChromaSubsampling == "422" {
			jpegOpts.ChromaSubsampling = image.YCbCrSubsampleRatio422
		} else {
			jpegOpts.ChromaSubsampling = image.YCbCrSubsampleRatio420
		}
		if !opts.JpegliProgressive {
			jpegOpts.ProgressiveLevel = 0
		}

		// Flatten transparent background to white for JPEG
		if hasAlpha {
			bg := image.NewRGBA(bounds)
			white := color.RGBA{255, 255, 255, 255}
			for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
				for x := bounds.Min.X; x < bounds.Max.X; x++ {
					bg.Set(x, y, white)
				}
			}
			img = imaging.Overlay(bg, img, image.Pt(0, 0), 1.0)
		}

		var buf bytes.Buffer
		if err := jpegli.Encode(&buf, img, jpegOpts); err != nil {
			// Fallback to standard jpeg if jpegli encounters error
			buf.Reset()
			if err2 := jpeg.Encode(&buf, img, &jpeg.Options{Quality: quality}); err2 != nil {
				return nil, 0, 0, fmt.Errorf("jpeg encode failed: %w", err)
			}
		}
		encoded = buf.Bytes()

		if opts.KeepExif && len(rawTiff) > 0 {
			encoded, _ = InjectExifJPEG(encoded, rawTiff)
		} else {
			encoded, _ = StripExifJPEG(encoded)
		}

	case FormatAVIF:
		// AVIF encoding
		avifOpts := avif.Options{
			Quality: quality,
			Speed:   8,
		}
		var buf bytes.Buffer
		if err := avif.Encode(&buf, img, avifOpts); err != nil {
			return nil, 0, 0, fmt.Errorf("avif encode failed: %w", err)
		}
		encoded = buf.Bytes()

		if opts.KeepExif && len(rawTiff) > 0 {
			encoded, _ = InjectExifAVIF(encoded, rawTiff)
		} else {
			encoded, _ = StripExifAVIF(encoded)
		}

	case FormatWebP:
		// WebP encoding
		var buf bytes.Buffer
		webpOpts := webp.Options{
			Quality: quality,
		}
		if err := webp.Encode(&buf, img, webpOpts); err != nil {
			return nil, 0, 0, fmt.Errorf("webp encode failed: %w", err)
		}
		encoded = buf.Bytes()

		if opts.KeepExif && len(rawTiff) > 0 {
			encoded, _ = InjectExifWebP(encoded, rawTiff, outW, outH, hasAlpha)
		} else {
			encoded, _ = StripExifWebP(encoded)
		}

	case FormatPNG:
		// PNG encoding with high compression
		var buf bytes.Buffer
		enc := png.Encoder{CompressionLevel: png.BestCompression}
		if err := enc.Encode(&buf, img); err != nil {
			return nil, 0, 0, fmt.Errorf("png encode failed: %w", err)
		}
		encoded = buf.Bytes()

		if opts.KeepExif && len(rawTiff) > 0 {
			encoded, _ = InjectExifPNG(encoded, rawTiff)
		} else {
			encoded, _ = StripExifPNG(encoded)
		}

	default:
		return nil, 0, 0, fmt.Errorf("unsupported target format: %s", targetFmt)
	}

	return encoded, outW, outH, nil
}
