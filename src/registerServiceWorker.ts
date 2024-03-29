/* eslint-disable no-console */

import { register } from "register-service-worker";
import Swal from "sweetalert2";
import "./App.css";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB",
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      if (
        Swal.fire({
          title: "Update",
          text: "Neues Update verfügbar, jetzt herunterladen?",
          showCancelButton: true,
          confirmButtonText: "Ja",
          cancelButtonText: "Nein",
          cancelButtonColor: "#FFFFFF",
          confirmButtonColor: "#1DB954",
        }).then((result) => {
          if (result.value) {
            const worker = registration.waiting;
            worker?.postMessage({ type: "SKIP_WAITING" });
          }
        })
      )
        console.log("New content is available; please refresh.");
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode.",
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });

  let refreshing: boolean;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
    Swal.fire({
      icon: "success",
      title: "Update durchgeführt",
      text: "Die neue Version wurde erfolgreich heruntergeladen.",
    });
  });
}
