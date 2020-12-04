/*
MIT License

Copyright (c) 2020 Edazpotato

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Add an event listener to the global scope which listens
//  for HTTP requests and calls the handler function.
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

// Function to use for generating a responce to all http
//  requests.
async function handleRequest(request) {
  // Define an array of redirect key-value objects.
  // The inital value is not used because I am loading the
  //  array from a seperatley hosted JSON file,
  //  but it exists to indicate how the objects
  //  should be shaped.
  let redirs = [
    {
      key: "",
      link: "https://edazpotato.github.io",
    },
  ];

  // Url to load. You can remove lines 46:54 if you want to
  //  hard-code the redirect key-value pairs in the above
  //  array.
  const dataUrl = "https://edazpotato.github.io/static/redirs.json";

  // Load and parse the externaly hosted redirect
  //  key-value pairs using the javascript fetch API.
  const res = await fetch(dataUrl);
  redirs = await res.json();

  // Get the redirect key from the URL path
  //  using a javascript URL object.
  const url = new URL(request.url);
  const path = url.pathname.slice(1, url.pathname.length + 1);

  // Search the list of redirect key-value pairs for a key
  //  that matches the one we just extracted from the URL.
  const redir = redirs.find((obj) => obj.key === path);

  if (redir) {
    // If we found a key that exists in the list of pairs,
    //  send a response with a success message and
    //  a header to instruct the web browser to load
    //  the url that corosponds with the matching key.
    return new Response(
      JSON.stringify({
        status: "success",
        message: `redirecting to ${redir.link}`,
      }),
      { status: 308, headers: { location: redir.link } }
    );
    // (The 308 status code means 'Permanent Redirect')
  } else {
    // If we couldn't find a mathing key, send an error
    //  message.
    return new Response(
      JSON.stringify({
        status: "error",
        message: "redirect not found",
      }),
      { status: 404 }
    );
    // (The 308 status code means 'Not Found')
  }
}
