import http.server
import socketserver
from subprocess import call
from os import curdir, sep

PORT = 9000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
call(["python","server.py"])