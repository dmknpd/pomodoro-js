const workTimer = document.querySelector(".work-timer");
const breakTimer = document.querySelector(".break-timer");
const header = document.querySelector(".header");
const workElement = document.querySelector(".work");
const breakElement = document.querySelector(".break");
const volumeContainer = document.querySelector(".volume-container");
const volumeInput = document.querySelector(".volume");
const alarm = document.querySelector(".alarm");

let volume = 0.5;
let workTime = 25;
let breakTime = 5;
let isWindowBig = false;
let isPaused = false;
let phase = "work";

const handleVolumeChange = () => {
  volume = event.target.value;
};

const changeTimer = (timer) => {
  let time = parseInt(timer.textContent);
  let num = parseInt(event.target.dataset.value);
  if (time + num > 0 && time + num <= 60) {
    time += num;
    timer.textContent = time;
  }
  return time;
};

//toggle side width and z-index
const toggleElementWidth = (mainElem, sideElem) => {
  if (mainElem.style.width === "100%") {
    mainElem.style.zIndex = "3";
    sideElem.style.zIndex = "2";
    mainElem.style.width = "50%";
    isWindowBig = false;
  } else {
    mainElem.style.zIndex = "5";
    sideElem.style.zIndex = "2";
    mainElem.style.width = "100%";
    isWindowBig = true;
  }
};

const toggleElementHeaders = (className, time) => {
  //arrows and title hide
  const title = document.querySelector(`.${className} .side-header`);
  const arrows = document.querySelectorAll(".timer-arrow");
  title.classList.add("hidden");
  arrows.forEach((arrow) => arrow.classList.toggle("hidden"));

  //timer font increase
  const timer = document.querySelector(`.${className} .timer`);
  timer.classList.toggle("big-font");

  //set header name
  if (header.textContent === "Pomodoro") {
    const name = className.charAt(0).toUpperCase() + className.slice(1);
    header.textContent = name;

    //microanimation for timer start
    timer.textContent = `${time}:00`;

    setTimeout(() => {
      timer.textContent = `${time} 00`;
    }, 300);
  } else {
    header.textContent = "Pomodoro";
    timer.textContent = time;

    setTimeout(() => {
      title.classList.remove("hidden");
    }, 200);
  }
};

const phaseChange = (timer) => {
  if (timer === "work") {
    if (!isWindowBig) {
      countdown(workTimer, workTime);
      phase = "work";
    }
    toggleElementWidth(workElement, breakElement);
    toggleElementHeaders("work", workTime);
  } else {
    if (!isWindowBig) {
      countdown(breakTimer, breakTime);
      phase = "break";
    }
    toggleElementWidth(breakElement, workElement);
    toggleElementHeaders("break", breakTime);
  }
};

const countdown = (timer, minutes) => {
  let seconds = minutes * 60;

  const countdownTimer = setInterval(() => {
    const minutesLeft = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    timer.textContent = `${minutesLeft}:${
      secondsLeft < 10 ? "0" : ""
    }${secondsLeft}`;

    // wrong timers protect
    if (!isWindowBig) {
      clearInterval(countdownTimer);
      timer.textContent = minutes;
    } else if (seconds === 0 && isWindowBig) {
      alarm.currentTime = 0;
      alarm.volume = volume;
      alarm.play();

      timer.textContent = minutes;
      clearInterval(countdownTimer);

      //auto phasechanger
      if (phase === "work") {
        phaseChange("work");
        phaseChange("break");
      } else {
        phaseChange("break");
        phaseChange("work");
      }
    } else if (!isWindowBig) {
      timer.textContent = minutes;
      clearInterval(countdownTimer);
    } else {
      seconds--;
    }
  }, 1000);
};

workElement.addEventListener("mouseover", () => {
  if (!isWindowBig) {
    workElement.style.width = "55%";
    workTimer.style.fontSize = "120px";
    breakElement.style.width = "45%";
  }
});

workElement.addEventListener("mouseout", () => {
  if (!isWindowBig) {
    workElement.style.width = "50%";
    workTimer.style.fontSize = "100px";
    breakElement.style.width = "50%";
  }
});

breakElement.addEventListener("mouseover", () => {
  if (!isWindowBig) {
    breakElement.style.width = "55%";
    breakTimer.style.fontSize = "120px";
    workElement.style.width = "45%";
  }
});

breakElement.addEventListener("mouseout", () => {
  if (!isWindowBig) {
    breakElement.style.width = "50%";
    breakTimer.style.fontSize = "100px";
    workElement.style.width = "50%";
  }
});

workElement.addEventListener("click", () => {
  if (!event.target.matches(".timer-arrow")) {
    phaseChange("work");
  } else if (event.target.matches(".timer-arrow")) {
    workTime = changeTimer(workTimer);
  }
});

breakElement.addEventListener("click", () => {
  if (!event.target.matches(".timer-arrow")) {
    phaseChange("break");
  } else if (event.target.matches(".timer-arrow")) {
    breakTime = changeTimer(breakTimer);
  }
});

volumeContainer.addEventListener("mouseover", () => {
  volumeInput.classList.remove("hidden");
});

volumeContainer.addEventListener("mouseout", () => {
  volumeInput.classList.add("hidden");
});
