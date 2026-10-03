package main

import (
	"embed"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

//go:embed all:frontend/dist
var assets embed.FS

func localFileMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/local-file") {
			filePath := r.URL.Query().Get("path")
			if filePath != "" {
				if _, err := os.Stat(filePath); err == nil {
					w.Header().Set("Access-Control-Allow-Origin", "*")
					w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
					http.ServeFile(w, r, filePath)
					return
				}
			}
			http.NotFound(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	imageService := NewImageService()

	app := application.New(application.Options{
		Name:        "PixZip Lite",
		Description: "Modern Native Image Compression Tool",
		Services: []application.Service{
			application.NewService(imageService),
		},
		Assets: application.AssetOptions{
			Handler:    application.AssetFileServerFS(assets),
			Middleware: localFileMiddleware,
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	win := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "PixZip Lite",
		Width:            1180,
		Height:           760,
		MinWidth:         860,
		MinHeight:        560,
		Frameless:        true,
		EnableFileDrop:   true,
		DevToolsEnabled:  true,
		BackgroundType:   application.BackgroundTypeSolid,
		BackgroundColour: application.NewRGBA(244, 244, 247, 255),
		Windows: application.WindowsWindow{
			BackdropType:                      application.None,
			Theme:                             application.SystemDefault,
			DisableFramelessWindowDecorations: false,
			WebView2CompositionHosting:        true,
			NonClientRegionSupport:            true,
		},
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropNormal,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		URL: "/",
	})

	// Native drag-and-drop: receive dropped file paths from File Explorer / Finder
	win.OnWindowEvent(events.Common.WindowFilesDropped, func(event *application.WindowEvent) {
		files := event.Context().DroppedFiles()
		log.Printf("[main] WindowFilesDropped: %v", files)
		if len(files) > 0 {
			app.Event.Emit("files-dropped", files)
		}
	})

	err := app.Run()
	if err != nil {
		log.Fatal(err)
	}
}
