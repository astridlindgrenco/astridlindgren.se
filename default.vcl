# Varnish instructions deployed on Elastx.
# Copy this to the proper location on the balancing node.
vcl 4.0;
import std;
import directors;
backend serv1 {
  .host = "10.50.4.92";
  .port = "8080";
  .probe = {
    .url = "/sitemap.xml";
    .timeout = 30s;
    .interval = 60s;
    .window = 5;
    .threshold = 2;
  }
}

sub vcl_init {
  new myclust = directors.hash();
  myclust.add_backend(serv1, 1);
}

sub vcl_deliver {
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
  unset resp.http.X-Varnish;
  unset resp.http.Server;
  unset resp.http.Via;
  unset resp.http.Link;
}

sub vcl_recv {
  unset req.http.Cookie; # 20180926
  if (req.http.Upgrade ~ "(?i)websocket") {
    set req.backend_hint = myclust.backend(client.identity);
    return (pipe);
  }
  else {
    set req.backend_hint = myclust.backend(client.identity);
  }
}

sub vcl_hash {
  hash_data(req.url);
  if (req.http.host) {
    hash_data(req.http.host);
  } else {
    hash_data(server.ip);
  }
  return (lookup);
}

sub vcl_fini {
  return (ok);
}

sub vcl_backend_response {
  if (beresp.http.content-type ~ "text"
   || beresp.http.content-type ~ "xml"
   || beresp.http.content-type ~ "json"
   || beresp.http.content-type ~ "ttf"
   || beresp.http.content-type ~ "svg"
   || beresp.http.content-type ~ "otf"
   || beresp.http.content-type ~ "ico"
   || beresp.http.content-type ~ "truetype"
   || beresp.http.content-type ~ "opentype"
   || beresp.http.content-type ~ "javascript"
  ) {
    set beresp.do_gzip = true;
  }
}
