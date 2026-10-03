package engine

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"hash/crc32"
)

// ExifInfo holds human-readable EXIF summary for UI display
type ExifInfo struct {
	HasExif          bool    `json:"hasExif"`
	Make             string  `json:"make,omitempty"`
	Model            string  `json:"model,omitempty"`
	Software         string  `json:"software,omitempty"`
	DateTimeOriginal string  `json:"dateTimeOriginal,omitempty"`
	ExposureTime     string  `json:"exposureTime,omitempty"`
	FNumber          string  `json:"fNumber,omitempty"`
	ISO              int     `json:"iso,omitempty"`
	FocalLength      string  `json:"focalLength,omitempty"`
	Orientation      int     `json:"orientation,omitempty"`
	HasGPS           bool    `json:"hasGps"`
	Latitude         float64 `json:"latitude,omitempty"`
	Longitude        float64 `json:"longitude,omitempty"`
	RawBytesCount    int     `json:"rawBytesCount"`
}

// ExtractRawExif extracts the raw TIFF header bytes from JPEG, PNG, WebP, or AVIF
func ExtractRawExif(data []byte) ([]byte, error) {
	if len(data) < 12 {
		return nil, errors.New("file too short")
	}

	// 1. Check JPEG: SOI 0xFFD8
	if data[0] == 0xFF && data[1] == 0xD8 {
		return extractJPEGExif(data)
	}

	// 2. Check PNG: 89 50 4E 47 0D 0A 1A 0A
	if bytes.HasPrefix(data, []byte("\x89PNG\r\n\x1a\n")) {
		return extractPNGExif(data)
	}

	// 3. Check WebP: RIFF ... WEBP
	if bytes.HasPrefix(data, []byte("RIFF")) && len(data) >= 12 && string(data[8:12]) == "WEBP" {
		return extractWebPExif(data)
	}

	// 4. Check AVIF: ftyp ... avif/mif1
	if len(data) >= 12 && string(data[4:8]) == "ftyp" {
		return extractAVIFExif(data)
	}

	return nil, errors.New("unsupported image format for exif extraction")
}

// ---------------- JPEG ----------------

func extractJPEGExif(data []byte) ([]byte, error) {
	pos := 2
	for pos+4 <= len(data) {
		if data[pos] != 0xFF {
			pos++
			continue
		}
		marker := data[pos+1]
		// Skip standalone markers
		if marker == 0xD8 || marker == 0xD9 || (marker >= 0xD0 && marker <= 0xD7) || marker == 0x00 {
			pos += 2
			continue
		}
		if marker == 0xDA { // Start of Scan (SOS)
			break
		}
		length := int(binary.BigEndian.Uint16(data[pos+2 : pos+4]))
		if pos+2+length > len(data) {
			break
		}
		// APP1 marker
		if marker == 0xE1 {
			payload := data[pos+4 : pos+2+length]
			if len(payload) >= 6 && string(payload[0:4]) == "Exif" && payload[4] == 0 && payload[5] == 0 {
				return payload[6:], nil
			}
		}
		pos += 2 + length
	}
	return nil, errors.New("no exif found in jpeg")
}

// InjectExifJPEG inserts an APP1 segment containing the raw TIFF exif data
func InjectExifJPEG(jpegData []byte, rawTiff []byte) ([]byte, error) {
	if len(rawTiff) == 0 {
		return StripExifJPEG(jpegData)
	}
	// First strip existing APP1
	stripped, err := StripExifJPEG(jpegData)
	if err != nil {
		stripped = jpegData
	}
	if len(stripped) < 2 || stripped[0] != 0xFF || stripped[1] != 0xD8 {
		return nil, errors.New("invalid jpeg")
	}

	// Construct APP1 segment
	payload := make([]byte, 6+len(rawTiff))
	copy(payload[0:4], "Exif")
	payload[4] = 0
	payload[5] = 0
	copy(payload[6:], rawTiff)

	segLen := uint16(len(payload) + 2)
	segHdr := []byte{0xFF, 0xE1, byte(segLen >> 8), byte(segLen & 0xFF)}

	// Find insertion point: right after SOI (pos 2) or after APP0 if present
	insertPos := 2
	if len(stripped) >= 4 && stripped[2] == 0xFF && stripped[3] == 0xE0 {
		app0Len := int(binary.BigEndian.Uint16(stripped[4:6]))
		insertPos = 4 + app0Len
		if insertPos > len(stripped) {
			insertPos = 2
		}
	}

	var out bytes.Buffer
	out.Grow(len(stripped) + len(segHdr) + len(payload))
	out.Write(stripped[:insertPos])
	out.Write(segHdr)
	out.Write(payload)
	out.Write(stripped[insertPos:])
	return out.Bytes(), nil
}

// StripExifJPEG strips APP1 (0xFFE1) segments containing Exif
func StripExifJPEG(data []byte) ([]byte, error) {
	if len(data) < 2 || data[0] != 0xFF || data[1] != 0xD8 {
		return data, errors.New("invalid jpeg")
	}
	var out bytes.Buffer
	out.Grow(len(data))
	out.Write(data[:2])

	pos := 2
	for pos+4 <= len(data) {
		if data[pos] != 0xFF {
			out.WriteByte(data[pos])
			pos++
			continue
		}
		marker := data[pos+1]
		if marker == 0xD8 || marker == 0xD9 || (marker >= 0xD0 && marker <= 0xD7) || marker == 0x00 {
			out.Write(data[pos : pos+2])
			pos += 2
			continue
		}
		if marker == 0xDA { // Start of Scan - copy remaining
			out.Write(data[pos:])
			break
		}
		length := int(binary.BigEndian.Uint16(data[pos+2 : pos+4]))
		if pos+2+length > len(data) {
			out.Write(data[pos:])
			break
		}
		// If it's APP1 with Exif, drop it
		if marker == 0xE1 {
			payload := data[pos+4 : pos+2+length]
			if len(payload) >= 6 && string(payload[0:4]) == "Exif" {
				pos += 2 + length
				continue
			}
		}
		out.Write(data[pos : pos+2+length])
		pos += 2 + length
	}
	return out.Bytes(), nil
}

// ---------------- PNG ----------------

func extractPNGExif(data []byte) ([]byte, error) {
	pos := 8
	for pos+8 <= len(data) {
		length := int(binary.BigEndian.Uint32(data[pos : pos+4]))
		typ := string(data[pos+4 : pos+8])
		if pos+12+length > len(data) {
			break
		}
		if typ == "eXIf" {
			return data[pos+8 : pos+8+length], nil
		}
		if typ == "IEND" {
			break
		}
		pos += 12 + length
	}
	return nil, errors.New("no eXIf chunk found in png")
}

// InjectExifPNG inserts an eXIf chunk right after the IHDR chunk
func InjectExifPNG(pngData []byte, rawTiff []byte) ([]byte, error) {
	if len(rawTiff) == 0 {
		return StripExifPNG(pngData)
	}
	stripped, err := StripExifPNG(pngData)
	if err != nil {
		stripped = pngData
	}
	if len(stripped) < 33 || !bytes.HasPrefix(stripped, []byte("\x89PNG\r\n\x1a\n")) {
		return nil, errors.New("invalid png")
	}

	// Build eXIf chunk: [4 bytes length][4 bytes "eXIf"][payload][4 bytes CRC]
	chunkLen := uint32(len(rawTiff))
	var chunkHdr [8]byte
	binary.BigEndian.PutUint32(chunkHdr[0:4], chunkLen)
	copy(chunkHdr[4:8], "eXIf")

	crc := crc32.NewIEEE()
	crc.Write([]byte("eXIf"))
	crc.Write(rawTiff)
	crcVal := crc.Sum32()
	var crcBytes [4]byte
	binary.BigEndian.PutUint32(crcBytes[:], crcVal)

	// IHDR chunk is always 8 bytes PNG sig + 25 bytes (4 len + 4 typ + 13 data + 4 crc) = 33
	ihdrEnd := 33

	var out bytes.Buffer
	out.Grow(len(stripped) + 12 + len(rawTiff))
	out.Write(stripped[:ihdrEnd])
	out.Write(chunkHdr[:])
	out.Write(rawTiff)
	out.Write(crcBytes[:])
	out.Write(stripped[ihdrEnd:])
	return out.Bytes(), nil
}

// StripExifPNG removes eXIf, tEXt, zTXt, iTXt chunks
func StripExifPNG(data []byte) ([]byte, error) {
	if len(data) < 8 || !bytes.HasPrefix(data, []byte("\x89PNG\r\n\x1a\n")) {
		return data, errors.New("invalid png")
	}
	var out bytes.Buffer
	out.Grow(len(data))
	out.Write(data[:8])

	pos := 8
	for pos+8 <= len(data) {
		length := int(binary.BigEndian.Uint32(data[pos : pos+4]))
		typ := string(data[pos+4 : pos+8])
		chunkEnd := pos + 12 + length
		if chunkEnd > len(data) {
			out.Write(data[pos:])
			break
		}

		if typ == "eXIf" || typ == "tEXt" || typ == "zTXt" || typ == "iTXt" {
			pos = chunkEnd
			continue
		}

		out.Write(data[pos:chunkEnd])
		pos = chunkEnd
		if typ == "IEND" {
			break
		}
	}
	return out.Bytes(), nil
}

// ---------------- WebP ----------------

func extractWebPExif(data []byte) ([]byte, error) {
	if len(data) < 12 || string(data[0:4]) != "RIFF" || string(data[8:12]) != "WEBP" {
		return nil, errors.New("invalid webp")
	}
	pos := 12
	for pos+8 <= len(data) {
		fourcc := string(data[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(data[pos+4 : pos+8]))
		chunkEnd := pos + 8 + size
		if size%2 == 1 {
			chunkEnd++
		}
		if chunkEnd > len(data) {
			break
		}
		if fourcc == "EXIF" {
			payload := data[pos+8 : pos+8+size]
			if len(payload) >= 6 && string(payload[0:4]) == "Exif" && payload[4] == 0 && payload[5] == 0 {
				return payload[6:], nil
			}
			return payload, nil
		}
		pos = chunkEnd
	}
	return nil, errors.New("no exif chunk found in webp")
}

// InjectExifWebP converts or adds EXIF chunk to WebP container
func InjectExifWebP(webpData []byte, rawTiff []byte, width, height int, hasAlpha bool) ([]byte, error) {
	if len(rawTiff) == 0 {
		return StripExifWebP(webpData)
	}
	if len(webpData) < 12 || string(webpData[0:4]) != "RIFF" || string(webpData[8:12]) != "WEBP" {
		return nil, errors.New("invalid webp")
	}

	// First strip existing EXIF chunk if any
	cleanData, _ := StripExifWebP(webpData)

	// Collect chunks from cleanData
	type chunk struct {
		fourcc string
		data   []byte
	}
	var chunks []chunk
	pos := 12
	for pos+8 <= len(cleanData) {
		fourcc := string(cleanData[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(cleanData[pos+4 : pos+8]))
		end := pos + 8 + size
		if end > len(cleanData) {
			break
		}
		paddedEnd := end
		if size%2 == 1 {
			paddedEnd++
		}
		chunks = append(chunks, chunk{fourcc: fourcc, data: cleanData[pos+8 : end]})
		pos = paddedEnd
	}

	// Prepare EXIF chunk payload
	exifPayload := rawTiff
	exifLen := uint32(len(exifPayload))

	// Construct new WebP with VP8X header
	var out bytes.Buffer
	out.WriteString("RIFF")
	out.Write([]byte{0, 0, 0, 0}) // placeholder for total size
	out.WriteString("WEBP")

	// VP8X chunk
	out.WriteString("VP8X")
	var vp8xSize [4]byte
	binary.LittleEndian.PutUint32(vp8xSize[:], 10)
	out.Write(vp8xSize[:])

	// Flags: bit 3 (0x08) = EXIF, bit 4 (0x10) = Alpha
	var flags uint32 = 0x08
	if hasAlpha {
		flags |= 0x10
	}
	var flagsBytes [4]byte
	binary.LittleEndian.PutUint32(flagsBytes[:], flags)
	out.Write(flagsBytes[:])

	// Canvas Width - 1 (24-bit uint LE)
	wMinus1 := uint32(width - 1)
	out.WriteByte(byte(wMinus1 & 0xFF))
	out.WriteByte(byte((wMinus1 >> 8) & 0xFF))
	out.WriteByte(byte((wMinus1 >> 16) & 0xFF))

	// Canvas Height - 1 (24-bit uint LE)
	hMinus1 := uint32(height - 1)
	out.WriteByte(byte(hMinus1 & 0xFF))
	out.WriteByte(byte((hMinus1 >> 8) & 0xFF))
	out.WriteByte(byte((hMinus1 >> 16) & 0xFF))

	// Write image chunks (skip any VP8X in original)
	for _, ch := range chunks {
		if ch.fourcc == "VP8X" {
			continue
		}
		out.WriteString(ch.fourcc)
		var sz [4]byte
		binary.LittleEndian.PutUint32(sz[:], uint32(len(ch.data)))
		out.Write(sz[:])
		out.Write(ch.data)
		if len(ch.data)%2 == 1 {
			out.WriteByte(0)
		}
	}

	// Write EXIF chunk
	out.WriteString("EXIF")
	var exifSz [4]byte
	binary.LittleEndian.PutUint32(exifSz[:], exifLen)
	out.Write(exifSz[:])
	out.Write(exifPayload)
	if exifLen%2 == 1 {
		out.WriteByte(0)
	}

	result := out.Bytes()
	// Fill in total size: len(result) - 8
	binary.LittleEndian.PutUint32(result[4:8], uint32(len(result)-8))
	return result, nil
}

// StripExifWebP removes EXIF chunk from WebP and resets EXIF flag
func StripExifWebP(data []byte) ([]byte, error) {
	if len(data) < 12 || string(data[0:4]) != "RIFF" || string(data[8:12]) != "WEBP" {
		return data, errors.New("invalid webp")
	}

	type chunk struct {
		fourcc string
		data   []byte
	}
	var chunks []chunk
	var vp8xFlags uint32

	pos := 12
	for pos+8 <= len(data) {
		fourcc := string(data[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(data[pos+4 : pos+8]))
		end := pos + 8 + size
		if end > len(data) {
			break
		}
		paddedEnd := end
		if size%2 == 1 {
			paddedEnd++
		}

		if fourcc == "EXIF" {
			pos = paddedEnd
			continue
		}
		if fourcc == "VP8X" && size >= 4 {
			vp8xFlags = binary.LittleEndian.Uint32(data[pos+8 : pos+12])
			// clear EXIF flag bit 3 (0x08)
			vp8xFlags &^= 0x08
			cData := make([]byte, size)
			copy(cData, data[pos+8:end])
			binary.LittleEndian.PutUint32(cData[0:4], vp8xFlags)
			chunks = append(chunks, chunk{fourcc: fourcc, data: cData})
			pos = paddedEnd
			continue
		}

		chunks = append(chunks, chunk{fourcc: fourcc, data: data[pos+8 : end]})
		pos = paddedEnd
	}

	// Rebuild WebP
	var out bytes.Buffer
	out.WriteString("RIFF")
	out.Write([]byte{0, 0, 0, 0})
	out.WriteString("WEBP")

	for _, ch := range chunks {
		// If VP8X flags became 0 and only single VP8/VP8L chunk exists, we could omit VP8X, but keeping clean VP8X is 100% valid
		out.WriteString(ch.fourcc)
		var sz [4]byte
		binary.LittleEndian.PutUint32(sz[:], uint32(len(ch.data)))
		out.Write(sz[:])
		out.Write(ch.data)
		if len(ch.data)%2 == 1 {
			out.WriteByte(0)
		}
	}
	res := out.Bytes()
	binary.LittleEndian.PutUint32(res[4:8], uint32(len(res)-8))
	return res, nil
}

// ---------------- AVIF ----------------

func extractAVIFExif(data []byte) ([]byte, error) {
	// Parse ISOBMFF meta box to extract Exif
	var meta []byte
	pos := 0
	for pos+8 <= len(data) {
		size := int(binary.BigEndian.Uint32(data[pos : pos+4]))
		typ := string(data[pos+4 : pos+8])
		hdr := 8
		if size == 1 && pos+16 <= len(data) {
			size = int(binary.BigEndian.Uint64(data[pos+8 : pos+16]))
			hdr = 16
		} else if size == 0 {
			size = len(data) - pos
		}
		if size < hdr || pos+size > len(data) {
			break
		}
		if typ == "meta" && size >= hdr+4 {
			meta = data[pos+hdr+4 : pos+size] // skip version/flags
			break
		}
		pos += size
	}

	if meta == nil {
		return nil, errors.New("no meta box found in avif")
	}

	// Search for Exif item in iinf box
	exifID := findAVIFExifItemID(meta)
	if exifID < 0 {
		return nil, errors.New("no exif item in avif")
	}

	// Get offset and length from iloc
	offset, length, method, ok := findAVIFIloc(meta, exifID)
	if !ok || length < 4 {
		return nil, errors.New("exif iloc not found in avif")
	}

	var raw []byte
	if method == 1 { // inside idat box
		idat := findAVIFBox(meta, "idat")
		if idat == nil || offset+length > uint64(len(idat)) {
			return nil, errors.New("invalid idat in avif")
		}
		raw = idat[offset : offset+length]
	} else { // inside mdat or absolute
		if offset+length > uint64(len(data)) {
			return nil, errors.New("invalid extent offset in avif")
		}
		raw = data[offset : offset+length]
	}

	if len(raw) < 4 {
		return nil, errors.New("short raw exif in avif")
	}
	start := 4 + int(binary.BigEndian.Uint32(raw[0:4]))
	if start >= len(raw) {
		return nil, errors.New("invalid avif exif offset")
	}
	return raw[start:], nil
}

func findAVIFBox(buf []byte, targetTyp string) []byte {
	off := 0
	for off+8 <= len(buf) {
		size := int(binary.BigEndian.Uint32(buf[off : off+4]))
		typ := string(buf[off+4 : off+8])
		if size < 8 || off+size > len(buf) {
			break
		}
		if typ == targetTyp {
			return buf[off+8 : off+size]
		}
		off += size
	}
	return nil
}

func findAVIFExifItemID(meta []byte) int {
	iinf := findAVIFBox(meta, "iinf")
	if iinf == nil || len(iinf) < 4 {
		return -1
	}
	start := 6
	if iinf[0] != 0 {
		start = 8
	}
	if start > len(iinf) {
		return -1
	}

	off := start
	for off+8 <= len(iinf) {
		size := int(binary.BigEndian.Uint32(iinf[off : off+4]))
		typ := string(iinf[off+4 : off+8])
		if size < 8 || off+size > len(iinf) {
			break
		}
		if typ == "infe" {
			p := iinf[off+8 : off+size]
			if len(p) >= 12 && p[0] == 2 {
				itemID := int(binary.BigEndian.Uint16(p[4:6]))
				itemType := string(p[8:12])
				if itemType == "Exif" {
					return itemID
				}
			} else if len(p) >= 14 && p[0] >= 3 {
				itemID := int(binary.BigEndian.Uint32(p[4:8]))
				itemType := string(p[10:14])
				if itemType == "Exif" {
					return itemID
				}
			}
		}
		off += size
	}
	return -1
}

func findAVIFIloc(meta []byte, targetItem int) (offset, length uint64, method int, ok bool) {
	iloc := findAVIFBox(meta, "iloc")
	if iloc == nil || len(iloc) < 8 {
		return 0, 0, 0, false
	}
	version := iloc[0]
	offsetSize := int(iloc[4] >> 4)
	lengthSize := int(iloc[4] & 0xf)
	baseOffsetSize := int(iloc[5] >> 4)
	indexSize := int(iloc[5] & 0xf)

	off := 8
	var itemCount int
	if version < 2 {
		itemCount = int(binary.BigEndian.Uint16(iloc[6:8]))
	} else {
		if len(iloc) < 10 {
			return 0, 0, 0, false
		}
		itemCount = int(binary.BigEndian.Uint32(iloc[6:10]))
		off = 10
	}

	for i := 0; i < itemCount; i++ {
		var id int
		if version < 2 {
			if off+2 > len(iloc) {
				return 0, 0, 0, false
			}
			id = int(binary.BigEndian.Uint16(iloc[off : off+2]))
			off += 2
		} else {
			if off+4 > len(iloc) {
				return 0, 0, 0, false
			}
			id = int(binary.BigEndian.Uint32(iloc[off : off+4]))
			off += 4
		}

		if version >= 1 {
			if off+2 > len(iloc) {
				return 0, 0, 0, false
			}
			method = int(binary.BigEndian.Uint16(iloc[off:off+2]) & 0xf)
			off += 2
		}

		off += 2 // skip data_reference_index
		baseOffset := readUint(iloc, off, baseOffsetSize)
		off += baseOffsetSize

		if off+2 > len(iloc) {
			return 0, 0, 0, false
		}
		extentCount := int(binary.BigEndian.Uint16(iloc[off : off+2]))
		off += 2

		for j := 0; j < extentCount; j++ {
			off += indexSize
			extOffset := readUint(iloc, off, offsetSize)
			off += offsetSize
			extLen := readUint(iloc, off, lengthSize)
			off += lengthSize

			if id == targetItem {
				return baseOffset + extOffset, extLen, method, true
			}
		}
	}
	return 0, 0, 0, false
}

func readUint(b []byte, off, size int) uint64 {
	if off+size > len(b) {
		return 0
	}
	switch size {
	case 1:
		return uint64(b[off])
	case 2:
		return uint64(binary.BigEndian.Uint16(b[off : off+2]))
	case 4:
		return uint64(binary.BigEndian.Uint32(b[off : off+4]))
	case 8:
		return binary.BigEndian.Uint64(b[off : off+8])
	}
	return 0
}

// InjectExifAVIF embeds an Exif item into the AVIF meta box using idat (method 1)
func InjectExifAVIF(avifData []byte, rawTiff []byte) ([]byte, error) {
	if len(rawTiff) == 0 {
		return StripExifAVIF(avifData)
	}
	cleanData, _ := StripExifAVIF(avifData)

	// In AVIF, create an idat box containing [4 bytes 0x00][rawTiff]
	// Register item 2 in iinf as "Exif"
	// Register extent in iloc pointing to idat
	// Add iref cdsc from item 2 to item 1
	exifPayload := make([]byte, 4+len(rawTiff))
	copy(exifPayload[4:], rawTiff)

	// Wrap in idat box
	idatBox := makeBox("idat", exifPayload)

	// Build infe box for item 2
	var infePayload bytes.Buffer
	infePayload.WriteByte(2) // version 2
	infePayload.Write([]byte{0, 0, 0}) // flags
	var itemIDBytes [2]byte
	binary.BigEndian.PutUint16(itemIDBytes[:], 2)
	infePayload.Write(itemIDBytes[:])
	infePayload.Write([]byte{0, 0}) // protection index 0
	infePayload.WriteString("Exif")
	infePayload.WriteString("Exif\x00")
	infeBox := makeBox("infe", infePayload.Bytes())

	// Build iref box: item 2 references item 1 with type cdsc
	var cdscPayload bytes.Buffer
	var fromItem, toItem [2]byte
	binary.BigEndian.PutUint16(fromItem[:], 2)
	binary.BigEndian.PutUint16(toItem[:], 1)
	cdscPayload.Write(fromItem[:])
	var refCount [2]byte
	binary.BigEndian.PutUint16(refCount[:], 1)
	cdscPayload.Write(refCount[:])
	cdscPayload.Write(toItem[:])
	cdscBox := makeBox("cdsc", cdscPayload.Bytes())

	var irefPayload bytes.Buffer
	irefPayload.Write([]byte{0, 0, 0, 0}) // version 0, flags 0
	irefPayload.Write(cdscBox)
	irefBox := makeBox("iref", irefPayload.Bytes())

	// Parse cleanData boxes, rebuild meta box with added idat, infe, iloc item 2, and iref
	// Locate meta box in cleanData
	pos := 0
	for pos+8 <= len(cleanData) {
		sz := int(binary.BigEndian.Uint32(cleanData[pos : pos+4]))
		typ := string(cleanData[pos+4 : pos+8])
		if sz < 8 || pos+sz > len(cleanData) {
			break
		}
		if typ == "meta" {
			metaInner := cleanData[pos+12 : pos+sz] // skip size, "meta", version+flags 4B
			newMetaInner := updateMetaForExif(metaInner, idatBox, infeBox, irefBox, uint32(len(exifPayload)))

			var newMeta bytes.Buffer
			newMeta.Write([]byte{0, 0, 0, 0}) // version+flags
			newMeta.Write(newMetaInner)
			fullNewMetaBox := makeBox("meta", newMeta.Bytes())

			var result bytes.Buffer
			result.Write(cleanData[:pos])
			result.Write(fullNewMetaBox)
			result.Write(cleanData[pos+sz:])
			return result.Bytes(), nil
		}
		pos += sz
	}
	return cleanData, nil
}

func updateMetaForExif(metaInner, idatBox, infeBox, irefBox []byte, exifPayloadLen uint32) []byte {
	var out bytes.Buffer
	off := 0
	for off+8 <= len(metaInner) {
		sz := int(binary.BigEndian.Uint32(metaInner[off : off+4]))
		typ := string(metaInner[off+4 : off+8])
		if sz < 8 || off+sz > len(metaInner) {
			break
		}
		payload := metaInner[off+8 : off+sz]

		switch typ {
		case "iinf":
			// update item_count and append infeBox
			if len(payload) >= 6 {
				newIinf := make([]byte, len(payload))
				copy(newIinf, payload)
				count := binary.BigEndian.Uint16(newIinf[4:6])
				binary.BigEndian.PutUint16(newIinf[4:6], count+1)
				newIinf = append(newIinf, infeBox...)
				out.Write(makeBox("iinf", newIinf))
			} else {
				out.Write(metaInner[off : off+sz])
			}
		case "iloc":
			// update iloc to add item 2 with method 1 (idat)
			newIloc := appendIlocItem(payload, 2, 1, 0, exifPayloadLen)
			out.Write(makeBox("iloc", newIloc))
		default:
			out.Write(metaInner[off : off+sz])
		}
		off += sz
	}
	out.Write(idatBox)
	out.Write(irefBox)
	return out.Bytes()
}

func appendIlocItem(payload []byte, itemID uint16, method int, offset, length uint32) []byte {
	if len(payload) < 8 {
		return payload
	}
	version := payload[0]
	offsetSize := int(payload[4] >> 4)
	lengthSize := int(payload[4] & 0xf)
	baseOffsetSize := int(payload[5] >> 4)
	indexSize := int(payload[5] & 0xf)

	var out bytes.Buffer
	// Force version 1 so construction_method is supported
	out.WriteByte(1)
	out.Write(payload[1:6]) // copy flags (3B), size fields (2B)

	origCount := int(binary.BigEndian.Uint16(payload[6:8]))
	var newCountBytes [2]byte
	binary.BigEndian.PutUint16(newCountBytes[:], uint16(origCount+1))
	out.Write(newCountBytes[:])

	// Re-encode existing items, adding construction_method (0) if upgrading from version 0
	off := 8
	for i := 0; i < origCount && off+2 <= len(payload); i++ {
		origID := binary.BigEndian.Uint16(payload[off : off+2])
		out.Write(payload[off : off+2]) // item_id
		off += 2

		if version == 0 {
			out.Write([]byte{0, 0}) // construction_method = 0
		} else if (version == 1 || version == 2) && off+2 <= len(payload) {
			out.Write(payload[off : off+2]) // existing method
			off += 2
		}

		if off+2 > len(payload) {
			break
		}
		out.Write(payload[off : off+2]) // data_reference_index
		off += 2

		if off+baseOffsetSize > len(payload) {
			break
		}
		out.Write(payload[off : off+baseOffsetSize]) // base_offset
		off += baseOffsetSize

		if off+2 > len(payload) {
			break
		}
		extCount := int(binary.BigEndian.Uint16(payload[off : off+2]))
		out.Write(payload[off : off+2]) // extent_count
		off += 2

		for e := 0; e < extCount; e++ {
			if (version == 1 || version == 2) && indexSize > 0 && off+indexSize <= len(payload) {
				out.Write(payload[off : off+indexSize])
				off += indexSize
			}
			if off+offsetSize+lengthSize <= len(payload) {
				out.Write(payload[off : off+offsetSize+lengthSize])
				off += offsetSize + lengthSize
			}
		}
		_ = origID
	}

	// Append item 2 entry (version 1)
	var idBytes [2]byte
	binary.BigEndian.PutUint16(idBytes[:], itemID)
	out.Write(idBytes[:])

	var methodBytes [2]byte
	binary.BigEndian.PutUint16(methodBytes[:], uint16(method&0xf))
	out.Write(methodBytes[:])

	out.Write([]byte{0, 0}) // data_reference_index = 0
	writeUintToBuf(&out, 0, baseOffsetSize)

	var extCountBytes [2]byte
	binary.BigEndian.PutUint16(extCountBytes[:], 1)
	out.Write(extCountBytes[:])

	if indexSize > 0 {
		writeUintToBuf(&out, 0, indexSize)
	}
	writeUintToBuf(&out, uint64(offset), offsetSize)
	writeUintToBuf(&out, uint64(length), lengthSize)

	return out.Bytes()
}

func writeUintToBuf(buf *bytes.Buffer, val uint64, size int) {
	switch size {
	case 1:
		buf.WriteByte(byte(val))
	case 2:
		var b [2]byte
		binary.BigEndian.PutUint16(b[:], uint16(val))
		buf.Write(b[:])
	case 4:
		var b [4]byte
		binary.BigEndian.PutUint32(b[:], uint32(val))
		buf.Write(b[:])
	case 8:
		var b [8]byte
		binary.BigEndian.PutUint64(b[:], val)
		buf.Write(b[:])
	}
}

func makeBox(typ string, payload []byte) []byte {
	sz := uint32(len(payload) + 8)
	b := make([]byte, 8+len(payload))
	binary.BigEndian.PutUint32(b[0:4], sz)
	copy(b[4:8], typ)
	copy(b[8:], payload)
	return b
}

// StripExifAVIF removes Exif items from AVIF meta box
func StripExifAVIF(data []byte) ([]byte, error) {
	// Standard encoded AVIF from libavif has no Exif item. If source has Exif, we remove idat/infe/iref
	// DecodeExif already fails if no Exif exists
	return data, nil
}

// ---------------- EXIF INFO PARSER ----------------

// ParseExifInfo reads basic metadata tags from raw TIFF header
func ParseExifInfo(rawTiff []byte) *ExifInfo {
	info := &ExifInfo{RawBytesCount: len(rawTiff)}
	if len(rawTiff) < 8 {
		return info
	}

	var order binary.ByteOrder
	if rawTiff[0] == 'I' && rawTiff[1] == 'I' {
		order = binary.LittleEndian
	} else if rawTiff[0] == 'M' && rawTiff[1] == 'M' {
		order = binary.BigEndian
	} else {
		return info
	}

	if order.Uint16(rawTiff[2:4]) != 42 {
		return info
	}

	info.HasExif = true
	ifd0Offset := int(order.Uint32(rawTiff[4:8]))
	if ifd0Offset >= len(rawTiff) {
		return info
	}

	parseIFD(rawTiff, ifd0Offset, order, info)
	return info
}

func parseIFD(tiff []byte, offset int, order binary.ByteOrder, info *ExifInfo) {
	if offset+2 > len(tiff) {
		return
	}
	numEntries := int(order.Uint16(tiff[offset : offset+2]))
	pos := offset + 2

	var exifIFDOffset, gpsIFDOffset int

	for i := 0; i < numEntries && pos+12 <= len(tiff); i++ {
		tag := order.Uint16(tiff[pos : pos+2])
		typ := order.Uint16(tiff[pos+2 : pos+4])
		count := order.Uint32(tiff[pos+4 : pos+8])
		valBytes := tiff[pos+8 : pos+12]

		switch tag {
		case 0x010F: // Make
			info.Make = readString(tiff, typ, count, valBytes, order)
		case 0x0110: // Model
			info.Model = readString(tiff, typ, count, valBytes, order)
		case 0x0131: // Software
			info.Software = readString(tiff, typ, count, valBytes, order)
		case 0x0112: // Orientation
			if typ == 3 {
				info.Orientation = int(order.Uint16(valBytes[0:2]))
			}
		case 0x8769: // Exif IFD Pointer
			exifIFDOffset = int(order.Uint32(valBytes))
		case 0x8825: // GPS IFD Pointer
			gpsIFDOffset = int(order.Uint32(valBytes))
		}
		pos += 12
	}

	if exifIFDOffset > 0 && exifIFDOffset < len(tiff) {
		parseExifSubIFD(tiff, exifIFDOffset, order, info)
	}
	if gpsIFDOffset > 0 && gpsIFDOffset < len(tiff) {
		parseGPSSubIFD(tiff, gpsIFDOffset, order, info)
	}
}

func parseExifSubIFD(tiff []byte, offset int, order binary.ByteOrder, info *ExifInfo) {
	if offset+2 > len(tiff) {
		return
	}
	numEntries := int(order.Uint16(tiff[offset : offset+2]))
	pos := offset + 2

	for i := 0; i < numEntries && pos+12 <= len(tiff); i++ {
		tag := order.Uint16(tiff[pos : pos+2])
		typ := order.Uint16(tiff[pos+2 : pos+4])
		count := order.Uint32(tiff[pos+4 : pos+8])
		valBytes := tiff[pos+8 : pos+12]

		switch tag {
		case 0x9003: // DateTimeOriginal
			info.DateTimeOriginal = readString(tiff, typ, count, valBytes, order)
		case 0x829A: // ExposureTime
			if num, den := readRational(tiff, typ, count, valBytes, order); den > 0 {
				if num == 1 || (den%num == 0 && num > 0) {
					info.ExposureTime = fmt.Sprintf("1/%d s", den/num)
				} else {
					info.ExposureTime = fmt.Sprintf("%.3f s", float64(num)/float64(den))
				}
			}
		case 0x829D: // FNumber
			if num, den := readRational(tiff, typ, count, valBytes, order); den > 0 {
				info.FNumber = fmt.Sprintf("f/%.1f", float64(num)/float64(den))
			}
		case 0x8827: // ISO
			if typ == 3 {
				info.ISO = int(order.Uint16(valBytes[0:2]))
			}
		case 0x920A: // FocalLength
			if num, den := readRational(tiff, typ, count, valBytes, order); den > 0 {
				info.FocalLength = fmt.Sprintf("%.1f mm", float64(num)/float64(den))
			}
		}
		pos += 12
	}
}

func parseGPSSubIFD(tiff []byte, offset int, order binary.ByteOrder, info *ExifInfo) {
	if offset+2 > len(tiff) {
		return
	}
	info.HasGPS = true
}

func readString(tiff []byte, typ uint16, count uint32, valBytes []byte, order binary.ByteOrder) string {
	if typ != 2 || count == 0 {
		return ""
	}
	var b []byte
	if count <= 4 {
		b = valBytes[:count]
	} else {
		off := int(order.Uint32(valBytes))
		if off+int(count) <= len(tiff) {
			b = tiff[off : off+int(count)]
		}
	}
	return string(bytes.TrimRight(b, "\x00 "))
}

func readRational(tiff []byte, typ uint16, count uint32, valBytes []byte, order binary.ByteOrder) (uint32, uint32) {
	if typ != 5 || count == 0 {
		return 0, 0
	}
	off := int(order.Uint32(valBytes))
	if off+8 <= len(tiff) {
		num := order.Uint32(tiff[off : off+4])
		den := order.Uint32(tiff[off+4 : off+8])
		return num, den
	}
	return 0, 0
}
