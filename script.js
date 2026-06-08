const form = document.querySelector("#appointment-form");
const note = document.querySelector("#form-note");
const dateInput = form?.elements.date;

const WHATSAPP_NUMBER = "918282821409";

if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isValidClinicSlot(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return false;
  }

  const selectedDate = new Date(`${dateValue}T00:00:00`);
  const day = selectedDate.getDay();
  const minutes = minutesFromTime(timeValue);

  if (day === 0) {
    return minutes >= 10 * 60 + 30 && minutes <= 12 * 60 + 30;
  }

  const morning = minutes >= 10 * 60 && minutes <= 14 * 60;
  const evening = minutes >= 17 * 60 + 30 && minutes <= 20 * 60;
  return morning || evening;
}

function setNote(message, state) {
  note.textContent = message;
  note.classList.remove("error", "success");
  if (state) {
    note.classList.add(state);
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const service = String(data.get("service") || "").trim();
  const doctor = String(data.get("doctor") || "").trim();
  const date = String(data.get("date") || "").trim();
  const time = String(data.get("time") || "").trim();

  if (!isValidClinicSlot(date, time)) {
    setNote(
      "Please choose an open clinic slot: Mon-Sat 10:00 AM-2:00 PM or 5:30 PM-8:00 PM, Sunday 10:30 AM-12:30 PM.",
      "error"
    );
    return;
  }

  const message = [
    "Hello Care32, I would like to book a dental appointment.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Preferred doctor: ${doctor}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    "Location: Care32 Super Speciality Dental Clinic, Kukatpally"
  ].join("\n");

  setNote("Opening WhatsApp with your appointment request.", "success");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const revealTargets = document.querySelectorAll(
  ".quick-contact, .split-section, .doctor-profile, .consultants, .technology, .journey-steps article, .booking-section, .faq-grid article"
);

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("in-view"));
}
