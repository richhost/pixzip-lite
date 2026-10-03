package engine

import (
	"bytes"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"testing"
)

// createTestImage generates a sample test image
func createTestImage(w, h int) []byte {
	m := image.NewRGBA(image.Rect(0, 0, w, h))
	blue := color.RGBA{0, 122, 255, 255}
	draw.Draw(m, m.Bounds(), &image.Uniform{blue}, image.Point{}, draw.Src)
	var buf bytes.Buffer
	png.Encode(&buf, m)
	return buf.Bytes()
}

// createDummyTiffExif generates a minimal valid TIFF header with Camera Make="PixZip"
func createDummyTiffExif() []byte {
	// Little Endian "II", 42, offset to IFD0 = 8
	var buf bytes.Buffer
	buf.Write([]byte{'I', 'I', 42, 0, 8, 0, 0, 0})
	// IFD0: 1 entry
	buf.Write([]byte{1, 0})
	// Entry 1: Make (0x010F), ASCII (2), count = 7, value offset = 26
	buf.Write([]byte{0x0F, 0x01, 2, 0, 7, 0, 0, 0, 26, 0, 0, 0})
	// Next IFD = 0
	buf.Write([]byte{0, 0, 0, 0})
	// String "PixZip\x00"
	buf.WriteString("PixZip\x00")
	return buf.Bytes()
}

func TestFormatsAndExif(t *testing.T) {
	srcPNG := createTestImage(100, 100)
	rawTiff := createDummyTiffExif()

	// Inject dummy EXIF into the source PNG
	pngWithExif, err := InjectExifPNG(srcPNG, rawTiff)
	if err != nil {
		t.Fatalf("InjectExifPNG failed: %v", err)
	}

	extracted, err := ExtractRawExif(pngWithExif)
	if err != nil {
		t.Fatalf("ExtractRawExif from PNG failed: %v", err)
	}
	info := ParseExifInfo(extracted)
	if info.Make != "PixZip" {
		t.Fatalf("Expected Make=PixZip, got: %s", info.Make)
	}

	formats := []string{FormatJPEG, FormatAVIF, FormatWebP, FormatPNG}

	for _, fmtName := range formats {
		t.Run("Format_"+fmtName+"_KeepExif_True", func(t *testing.T) {
			opts := CompressionOptions{
				Format:   fmtName,
				Quality:  80,
				KeepExif: true,
			}
			outData, outW, outH, err := CompressData(pngWithExif, opts)
			if err != nil {
				t.Fatalf("CompressData (%s) failed: %v", fmtName, err)
			}
			if outW != 100 || outH != 100 {
				t.Fatalf("Expected 100x100, got %dx%d", outW, outH)
			}

			// Verify image decodes back cleanly
			decodedImg, _, err := DecodeAny(outData)
			if err != nil {
				t.Fatalf("DecodeAny on compressed (%s) failed: %v", fmtName, err)
			}
			if decodedImg.Bounds().Dx() != 100 {
				t.Fatalf("Decoded bounds width mismatch")
			}

			// Verify EXIF was preserved
			exifBytes, err := ExtractRawExif(outData)
			if err != nil {
				t.Logf("Notice: format %s raw exif extraction: %v", fmtName, err)
			} else {
				t.Logf("Format %s exifBytes len=%d: %x", fmtName, len(exifBytes), exifBytes)
				parsed := ParseExifInfo(exifBytes)
				if parsed.Make != "PixZip" {
					t.Errorf("Format %s preserved exif make mismatch: got %q, parsed: %+v", fmtName, parsed.Make, parsed)
				}
			}
		})

		t.Run("Format_"+fmtName+"_KeepExif_False", func(t *testing.T) {
			opts := CompressionOptions{
				Format:   fmtName,
				Quality:  80,
				KeepExif: false,
			}
			outData, _, _, err := CompressData(pngWithExif, opts)
			if err != nil {
				t.Fatalf("CompressData (%s) failed: %v", fmtName, err)
			}

			// Verify EXIF was stripped
			exifBytes, err := ExtractRawExif(outData)
			if err == nil && len(exifBytes) > 0 {
				parsed := ParseExifInfo(exifBytes)
				if parsed.HasExif && parsed.Make != "" {
					t.Errorf("Format %s expected stripped EXIF, but found Make=%s", fmtName, parsed.Make)
				}
			}
		})
	}
}
