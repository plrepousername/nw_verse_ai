from http.server import HTTPServer, SimpleHTTPRequestHandler

class VoskServer(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Diese Header erlauben Vosk den Zugriff auf den Arbeitsspeicher (WebAssembly)
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()

print("Bibel-Lauscher Server gestartet!")
print("Öffne: http://localhost:8001")
HTTPServer(('localhost', 8001), VoskServer).serve_forever()