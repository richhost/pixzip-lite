package main

import (
	"os"
	"path/filepath"
	"testing"

	"changeme/engine"
)

func TestImageServiceCompress(t *testing.T) {
	// Prepare sample file
	sampleSource := filepath.Join("frontend", "public", "sample-dog.jpg")
	if _, err := os.Stat(sampleSource); err != nil {
		t.Skipf("sample-dog.jpg not found: %v", err)
	}

	tempDir := t.TempDir()
	testImg := filepath.Join(tempDir, "input.jpg")
	data, err := os.ReadFile(sampleSource)
	if err != nil {
		t.Fatalf("failed to read sample: %v", err)
	}
	if err := os.WriteFile(testImg, data, 0644); err != nil {
		t.Fatalf("failed to write test img: %v", err)
	}

	svc := NewImageService()

	// 1. Test ScanFiles
	items, err := svc.ScanFiles([]string{testImg})
	if err != nil {
		t.Fatalf("ScanFiles failed: %v", err)
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 item, got %d", len(items))
	}
	t.Logf("ScanFiles item: %+v", items[0])

	formats := []string{"jpeg", "webp", "avif", "png"}
	keepExifOptions := []bool{true, false}

	for _, fmtName := range formats {
		for _, keepExif := range keepExifOptions {
			task := CompressTask{
				ID:             "test-task",
				InputPath:      testImg,
				OutputDir:      tempDir,
				OriginalOutput: false,
				Suffix:         "-out-" + fmtName,
				Format:         fmtName,
				Quality:        75,
				ResizeMode:     "fit",
				Width:          400,
				Height:         400,
				KeepExif:       keepExif,
			}

			res := svc.Compress(task)
			if !res.Success {
				t.Fatalf("Compress failed for format %s keepExif %v: %s", fmtName, keepExif, res.Error)
			}
			if res.CompressedSize <= 0 {
				t.Fatalf("CompressedSize is zero for format %s keepExif %v", fmtName, keepExif)
			}
			t.Logf("Compress [%s] keepExif=%v: orig=%d -> comp=%d (saving %.1f%%, %dx%d, %dms)",
				fmtName, keepExif, res.OriginalSize, res.CompressedSize,
				float64(res.OriginalSize-res.CompressedSize)/float64(res.OriginalSize)*100,
				res.CompressedWidth, res.CompressedHeight, res.DurationMs,
			)

			// Verify output exists and is readable
			outBytes, err := os.ReadFile(res.OutputPath)
			if err != nil {
				t.Fatalf("cannot read output: %v", err)
			}
			exifBytes, err := engine.ExtractRawExif(outBytes)
			if keepExif {
				// If original had EXIF, output should preserve it
				origExif, _ := engine.ExtractRawExif(data)
				if len(origExif) > 0 && (err != nil || len(exifBytes) == 0) {
					t.Errorf("format %s expected EXIF preserved, got err=%v, len=%d", fmtName, err, len(exifBytes))
				}
			} else {
				if len(exifBytes) > 0 {
					t.Errorf("format %s expected EXIF stripped, but found len=%d", fmtName, len(exifBytes))
				}
			}
		}
	}
}
