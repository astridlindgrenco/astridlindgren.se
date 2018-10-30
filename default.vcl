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

acl purge {
        "10.50.4.92"/24;
}

sub vcl_recv {
  # Allow the backend to serve up stale content if it is responding slowly.
  #set req.grace = 15s;

  # The infamous shellshock
  if ( req.http.User-Agent ~ "[(][^)]*[)][^{]*[{][^;]*[;][^}]*[}][^;]*[;]" ) {
    return(synth( 418, "I'm a teapot" ));
  }

  # http to https
  #if (client.ip != "127.0.0.1" && req.http.X-Forwarded-Proto !~ "(?i)https") {
  #  set req.http.x-redir = "https://www.astridlindgren.com" + req.url;
  #  return(synth(850, ""));
  #}
  # purge
  if (req.method == "PURGE") {
    if (!client.ip ~ purge) {
      return(synth(405,"Not allowed."));
    }
    return (purge);
  }
  # bots and spams
  if (req.url ~ "\.php") {
    return (synth(404, "Unknown."));
  }
  if (req.url ~ "\.asp") {
    return (synth(404, "Unknown."));
  }
  # redirects
  if (req.url ~ "/en/node/566") { return (synth(301, "/sv/verken/sangerna/vargsangen")); }
  if (req.url ~ "/en/node/565") { return (synth(301,"/sv/verken/sangerna/har-kommer-pippi-langstrump")); }
  if (req.url ~ "/en/node/569") { return (synth(301,"/sv/verken/sangerna/du-kare-lille-snickerbo")); }
  if (req.url ~ "/en/node/561") { return (synth(301,"/sv/verken/sangerna/alla-ska-sova-for-nu-ar-det-natt")); }
  if (req.url ~ "/en/node/487") { return (synth(301,"/sv/astrid-lindgren/astrid-i-varlden")); }
  if (req.url ~ "/en/node/452") { return (synth(301,"/sv/karaktarerna/broderna-lejonhjarta")); }
  if (req.url ~ "/en/node/567") { return (synth(301,"/sv/verken/sangerna/luffarvisan")); }
  if (req.url ~ "/en/node/454") { return (synth(301,"/sv/karaktarerna/ronja")); }
  if (req.url ~ "/en/node/542") { return (synth(301,"/sv/verken/sangerna")); }
  if (req.url ~ "/en/node/457") { return (synth(301,"/sv/film/pippi-langstrump-1969")); }
  if (req.url ~ "/en/node/497") { return (synth(301,"/sv/astrid-lindgren/yrkeslivet")); }
  if (req.url ~ "/en/node/180") { return (synth(301,"/sv/astrid-lindgren/barndomen/foraldrarna")); }
  if (req.url ~ "/en/node/300") { return (synth(301,"/sv/astrid-lindgren/ungdomen")); }
  if (req.url ~ "/en/node/475") { return (synth(301,"/sv/astrid-lindgren/astrid-i-varlden")); }
  if (req.url ~ "/en/node/541") { return (synth(301,"/sv/verken/filmlista")); }
  if (req.url ~ "/en/node/179") { return (synth(301,"/sv/astrid-lindgren/barndomen")); }
  if (req.url ~ "/en/node/258") { return (synth(301,"/sv/astrid-lindgren/priser-och-utmarkelser")); }
  if (req.url ~ "/en/node/313") { return (synth(301,"/sv/karaktarerna")); }
  if (req.url ~ "/en/node/564") { return (synth(301,"/sv/verken/sangerna/var-pa-saltkrakan")); }
  if (req.url ~ "/en/node/432") { return (synth(301,"/sv/karaktarerna/pippi-langstrump")); }
  if (req.url ~ "/en/node/568") { return (synth(301,"/sv/verken/sangerna/varldens-basta-karlsson")); }
  if (req.url ~ "/en/node/130") { return (synth(301,"/sv/verken/illustrationerna/ilon-wikland")); }
  if (req.url ~ "/en/node/472") { return (synth(301,"/sv/karaktarerna/emil-i-lonneberga")); }
  if (req.url ~ "/en/node/493") { return (synth(301,"/sv/karaktarerna/madicken")); }
  if (req.url ~ "/en/node/257") { return (synth(301,"/sv/astrid-lindgren/opinionsbildaren")); }
  if (req.url ~ "/en/node/453") { return (synth(301,"/sv/karaktarerna/karlsson-pa-taket")); }
  if (req.url ~ "/en/node/469") { return (synth(301,"/sv/bok/allrakaraste-syster")); }
  if (req.url ~ "/en/node/463") { return (synth(301,"/sv/karaktarerna/bullerbyn")); }
  if (req.url ~ "/en/node/2003") { return (synth(301,"/sv/astrid-lindgren/arvet-efter-astrid-lindgren/astrid-lindgren-priset")); }
  if (req.url ~ "/en/node/503") { return (synth(301,"/sv/verken/boklista?character=&type=&authors=&content=Om+Astrid&illustrators=&publicist=&sort_by=author_year&view_by=grid")); }
  if (req.url ~ "/en/node/537") { return (synth(301,"/sv/foretaget/verksamhetsomraden/teater")); }
  if (req.url ~ "/en/node/134") { return (synth(301,"/sv/verken/illustrationerna/marit-tornqvist")); }
  if (req.url ~ "/en/node/181") { return (synth(301,"/sv/astrid-lindgren/barndomen/syskonen")); }
  if (req.url ~ "/en/node/2825") { return (synth(301,"/sv/bok/vad-gor-pippi")); }
  if (req.url ~ "/en/node/456") { return (synth(301,"/sv/karaktarerna/madicken")); }
  if (req.url ~ "/en/node/74") { return (synth(301,"/sv/karaktarerna/rasmus-pa-luffen")); }
  if (req.url ~ "/en/node/143") { return (synth(301,"/sv/astrid-lindgren/opinionsbildaren")); }
  if (req.url ~ "/en/node/1604") { return (synth(301,"/sv/verken/filmlista")); }
  if (req.url ~ "/en/node/197") { return (synth(301,"/sv/karaktarerna/madicken")); }
  if (req.url ~ "/en/node/10") { return (synth(301,"/sv/karaktarerna/masterdetektiven")); }
  if (req.url ~ "/en/node/1802") { return (synth(301,"/sv/bok/pippi-flyttar-in")); }
  if (req.url ~ "/en/node/2831") { return (synth(301,"/sv/karaktarerna/emil-i-lonneberga")); }
  if (req.url ~ "/en/node/471") { return (synth(301,"/sv/film/pelle-flyttar-till-komfusenbo")); }
  if (req.url ~ "/sv/node/1989") { return (synth(301,"/en/about-astrid-lindgren/childhood/the-siblings")); }
  if (req.url ~ "/en/node/305") { return (synth(301,"/sv/karaktarerna/mio")); }
  if (req.url ~ "/en/node/460") { return (synth(301,"/sv/karaktarerna/lotta-pa-brakmakargatan")); }
  if (req.url ~ "/en/node/485") { return (synth(301,"/sv/verken/boklista?character=W7d4KxMAAGwg7q_B&type=&authors=&content=&illustrators=&publicist=&sort_by=author_year&view_by=grid")); }
  if (req.url ~ "/en/node/517") { return (synth(301,"/sv/foretaget")); }
  if (req.url ~ "/en/node/58") { return (synth(301,"/sv/bok/jag-vill-inte-ga-och-lagga-mig")); }
  if (req.url ~ "/en/node?page=2") { return (synth(301,"/en/characters/the-brothers-lionheart")); }
  if (req.url ~ "/en/node/2805") { return (synth(301,"/sv/bok/sunnanang2003")); }
  if (req.url ~ "/en/node/337") { return (synth(301,"/sv/astrid-lindgren/arvet-efter-astrid-lindgren/astrid-lindgren-priset")); }
  if (req.url ~ "/en/node/494") { return (synth(301,"/sv/film/tjorven-och-mysak")); }
  if (req.url ~ "/en/node/605") { return (synth(301,"/sv/bok/pippi-gar-till-sjoss")); }
  if (req.url ~ "/en/node/607") { return (synth(301,"/sv/bok/pippi-flyttar-in")); }
  if (req.url ~ "/en/node/622") { return (synth(301,"/sv/bok/en-bunt-visor-for-pippi-emil-och-andra")); }
  if (req.url ~ "/en/node?page=19") { return (synth(301,"/sv/karaktarerna/masterdetektiven")); }

  if (req.http.host ~ "astridlindgren.se" && req.url ~ "/ru") {
    return (synth(301, "/en"));
  }
  if (req.http.host ~ "astridlindgren.se" && req.url ~ "/en") {
    if (req.url ~ "person") {return (synth(301, "/en/about-astrid-lindgren"));}
    if (req.url ~ "her-works") {return (synth(301, "/en/the-works"));}
    if (req.url ~ "more-facts") {return (synth(301, "/en/about-astrid-lindgren"));}
    if (req.url ~ "characters") {return (synth(301, "/en/characters"));}
    if (req.url ~ "around-world") {return (synth(301, "/en/astrid-worldwide"));}
    if (req.url ~ "culture-centre") {return (synth(301, "/en/places-to-visit"));}
    if (req.url ~ "experience-it-live") {return (synth(301, "/en/places-to-visit"));}
    if (req.url ~ "faq") {return (synth(301, "/en/frequently-asked-questions"));}
    if (req.url ~ "pressroom") {return (synth(301, "/en/press"));}
    if (req.url ~ "contact-us") {return (synth(301, "/en/the-company/contact-us"));}
    return (synth(301, "/en"));
  }
  if (req.http.host ~ "astridlindgren.se" && req.url ~ "/de") {
    return (synth(301, "/en")); # temporary until release of german pages
    if (req.url ~ "der-mensch") {return (synth(301, "/de/der-mensch"));}
    if (req.url ~ "das-werk") {return (synth(301, "/de/das-werk"));}
    if (req.url ~ "figuren") {return (synth(301, "/de/figuren"));}
    return (synth(301, "/de"));
  }
  if (req.http.host ~ "astridlindgren.se") { # all swedish pages
    if (req.url ~ "manniskan") {return (synth(301, "/sv/astrid-lindgren"));}
    if (req.url ~ "verken") {return (synth(301, "/sv/verken"));}
    if (req.url ~ "mer-fakta") {return (synth(301, "/sv/astrid-lindgren"));}
    if (req.url ~ "karaktarerna") {return (synth(301, "/sv/karaktarerna"));}
    if (req.url ~ "lekstugan") {return (synth(301, "/sv/karaktarerna/pippi-langstrump/lek-och-pyssla"));}
    if (req.url ~ "lekstugan") {return (synth(301, "/sv/karaktarerna/pippi-langstrump/lek-och-pyssla"));}
    if (req.url ~ "varlden-runt") {return (synth(301, "/sv/astrid-i-varlden"));}
    if (req.url ~ "kulturcentret") {return (synth(301, "/sv/platser-att-besoka"));}
    if (req.url ~ "aktuellt") {return (synth(301, "/sv/nyhetsrummet"));}
    if (req.url ~ "upplev-i-verkligheten") {return (synth(301, "/sv/platser-att-besoka"));}
    if (req.url ~ "faq") {return (synth(301, "/sv/vanliga-fragor-och-svar"));}
    if (req.url ~ "pressrum") {return (synth(301, "/sv/nyhetsrummet"));}
    if (req.url ~ "kontakt-0") {return (synth(301, "/sv/foretaget/kontakt"));}
    return (synth(301, "/sv"));
  }
  if (req.http.host ~ "astridlindgrenab.se|saltkrakan.se" && req.url ~ "/en") {
    if (req.url ~ "faq-2") {return (synth(301, "/en/frequently-asked-questions"));}
    if (req.url ~ "our-view-on-copyright") {return (synth(301, "/en/the-company"));}
    if (req.url ~ "contact") {return (synth(301, "/en/the-company/contact-us"));}
    return (synth(301, "/en/the-company"));
  }
  if (req.http.host ~ "astridlindgrenab.se|saltkrakan.se") {
    if (req.url ~ "lar-kanna-saltkrakan/verksamheter") {return (synth(301, "/sv/foretaget/verksamhetsomraden"));}
    if (req.url ~ "lar-kanna-saltkrakan") {return (synth(301, "/sv/foretaget/om-oss"));}
    if (req.url ~ "vanliga-fragor-och-svar") {return (synth(301, "/sv/vanliga-fragor-och-svar"));}
    if (req.url ~ "samarbeten") {return (synth(301, "/sv/foretaget/samarbeten"));}
    if (req.url ~ "var-upphovsratt") {return (synth(301, "/sv/foretaget"));}
    if (req.url ~ "aktuellt-och-arkiv") {return (synth(301, "/sv/nyhetsrummet"));}
    if (req.url ~ "besoksmal") {return (synth(301, "/sv/platser-att-besoka"));}
    if (req.url ~ "kontakt") {return (synth(301, "/sv/foretaget/kontakt"));}
    if (req.url ~ "press") {return (synth(301, "/sv/nyhetsrummet"));}
    return (synth(301, "/sv/foretaget"));
  }
  if (req.http.host ~ "(astridlindgren.se|astridlindgrentext.se)") {
    return (synth(301, "/sv"));
  }

  if (req.http.Upgrade ~ "(?i)websocket") {
    set req.backend_hint = myclust.backend(client.identity);
    return (pipe);
  }
  else {
    set req.backend_hint = myclust.backend(client.identity);
  }

  # Remove all cookies for static files
  # A valid discussion could be held on this line: do you really need to cache static files that don't cause load? Only if you have memory left.
  # Sure, there's disk I/O, but chances are your OS will already have these files in their buffers (thus memory).
  # Before you blindly enable this, have a read here: https://ma.ttias.be/stop-caching-static-files/
  if (req.url ~ "^[^?]*\.(7z|avi|bmp|bz2|css|csv|doc|docx|eot|flac|flv|gif|gz|ico|jpeg|jpg|js|less|mka|mkv|mov|mp3|mp4|mpeg|mpg|odt|otf|ogg|ogm|opus|pdf|png|ppt|pptx|rar|rtf|svg|svgz|swf|tar|tbz|tgz|ttf|txt|txz|wav|webm|webp|woff|woff2|xls|xlsx|xml|xz|zip)(\?.*)?$") {
    unset req.http.Cookie;
    return (hash);
  }

  return (hash);

}

sub vcl_synth {
    if (resp.status == 850) {
       set resp.http.Location = req.http.x-redir;
       set resp.status = 301;
       return (deliver);
    }
    if (resp.status == 301 || resp.status == 302) {
        set resp.http.location = "https://www.astridlindgren.com" + resp.reason;
        set resp.reason = "Moved";
        return (deliver);
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
  # Enable leverage browser caching in Varnish
  if (bereq.url ~ "\.(png|gif|jpg|swf|svg|ttf|otf|ico|css|js)$") {
    unset beresp.http.set-cookie;
    set beresp.http.cache-control = "max-age = 2592000";
  }
  # Don't cache 50x responses
  if (beresp.status == 500 || beresp.status == 502 || beresp.status == 503 || beresp.status == 504) {
    return (abandon);
  }

  # Zip text resources
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

  # Allow stale content, in case the backend goes down.
  set beresp.grace = 5m;
  set beresp.keep = 10m;
}


