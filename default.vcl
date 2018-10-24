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
  # redirects
  if (req.http.host ~ "astridlindgren.se" && req.url ~ "/sv") {
    if (req.url ~ "manniskan") {return (synth(301, "/sv/astrid-lindgren"));}
    if (req.url ~ "verken") {return (synth(301, "/sv/verken"));}
    if (req.url ~ "mer-fakta") {return (synth(301, "/sv/astrid-lindgren"));}
    if (req.url ~ "karaktarerna") {return (synth(301, "/sv/karaktarerna"));}
    if (req.url ~ "lekstugan") {return (synth(301, "sv/karaktarerna/pippi-langstrump/lek-och-pyssla"));}
    if (req.url ~ "lekstugan") {return (synth(301, "sv/karaktarerna/pippi-langstrump/lek-och-pyssla"));}
    if (req.url ~ "varlden-runt") {return (synth(301, "/sv/astrid-i-varlden"));}
    if (req.url ~ "kulturcentret") {return (synth(301, "/sv/platser-att-besoka"));}
    if (req.url ~ "aktuellt") {return (synth(301, "/sv/nyhetsrummet"));}
    if (req.url ~ "upplev-i-verkligheten") {return (synth(301, "/sv/platser-att-besoka"));}
    if (req.url ~ "faq") {return (synth(301, "/sv/vanliga-fragor-och-svar"));}
    if (req.url ~ "pressrum") {return (synth(301, "/sv/nyhetsrummet"));}
    if (req.url ~ "kontakt-0") {return (synth(301, "/sv/foretaget/kontakt"));}
    return (synth(301, "/sv"));
  }
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
    if (req.url ~ "pressroom") {return (synth(301, "/en"));}
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
  if (req.http.host ~ "astridlindgrenab.se" && req.url ~ "/en") {
    if (req.url ~ "faq-2") {return (synth(301, "/en/frequently-asked-questions"));}
    if (req.url ~ "our-view-on-copyright") {return (synth(301, "/en/the-company"));}
    if (req.url ~ "contact") {return (synth(301, "/en/the-company/contact-us"));}
    return (synth(301, "/en/the-company"));
  }
  if (req.http.host ~ "astridlindgrenab.se") {
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

  unset req.http.Cookie; # 20180926
  if (req.http.Upgrade ~ "(?i)websocket") {
    set req.backend_hint = myclust.backend(client.identity);
    return (pipe);
  }
  else {
    set req.backend_hint = myclust.backend(client.identity);
  }
}

sub vcl_synth {
    if (resp.status == 301 || resp.status == 302) {
        # set resp.http.location = "http://www.astridlindgren.com" + resp.reason;
        set resp.http.location = "http://212.237.144.151" + resp.reason;
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
