// const $numberWords = document.querySelector(".header__length .active").textContent;
const $initialValor = document.querySelector(".header__length .active").textContent
const $input = document.querySelector("#input");
const $paragraph = document.querySelector(".paragraph")
const $counter = document.querySelector(".counter")
let currentTime = $initialValor;

const getWords = async () => {
  const res = await fetch(`https://random-word-api.herokuapp.com//word?number=15`);
  const data = await res.json();
  setParagraph(data);
}

const setParagraph = (words) => {
  $paragraph.innerHTML = words.map(word => {
    letters = word.split("");
    return (
      `<word>${letters.map(letter => `<letter>${letter}</letter>`).join("")}</word>`
    )
  }).join(" ")
  
  const firstWord = $paragraph.querySelector("word");
  firstWord.classList.add("active");;
  const firstLetter = firstWord.querySelector("letter");
  firstLetter.classList.add("active")
  
  const intervalId = setInterval(() => {
    currentTime--;
    $counter.textContent = currentTime;
    if(currentTime === 0) {
      clearInterval(intervalId);
      gameOver();  
    }
  }, 1000);
}


const initEvents = () => {
  document.addEventListener("keydown", ()=>$input.focus());
  $input.addEventListener("keydown", onkeyDown);
  $input.addEventListener("keyup", onkeyUp);
}
  
const onkeyDown = (event) => {
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $currentWord.querySelector("letter.active");
  const {key} = event;
  if (key === " ") {
    event.preventDefault();
    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector("letter");

    $currentWord.classList.remove("active", "marked");
    $currentLetter.classList.remove("active");

    $nextWord.classList.add("active");
    $nextLetter.classList.add("active");

    $input.value = "";

    const hasMissedLetters = $currentWord.querySelectorAll("letter:not(.correct)").length > 0;
    const classToAdd = hasMissedLetters ? "marked" : "correct";
    $currentWord.classList.add(classToAdd);
    return
  }
  if (key === "Backspace") {
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if (!$prevWord && !$prevLetter) {
      event.preventDefault();
      return;
    }
    const $wordMarked = $paragraph.querySelector("word.marked");
    if($wordMarked && !$prevLetter) {
      event.preventDefault();
      $prevWord.classList.remove("marked");
      $prevWord.classList.add("active");
      
      const $letterToGo = $prevWord.querySelector("letter:last-child");
      console.log($letterToGo);
      

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");

      $input.value = [
        ...$prevWord.querySelectorAll("letter.correct, letter.incorrect")
      ].map($element => {
        return $element.classList.contains("correct") ? $element.innerText : "*"
      })
      .join("");
    }
  }
}

const onkeyUp = () => {
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $currentWord?.querySelector("letter.active");
  const currentWord = $currentWord.textContent.trim().toLowerCase();
  $input.maxLength = currentWord.length;

  console.log({value: $input.value, currentWord});
  const $allLetters = $currentWord.querySelectorAll("letter");
  $allLetters.forEach($letter => $letter.classList.remove("correct", "incorrect"))

  $input.value.split("").forEach((char,index) => {
    const $letter = $allLetters[index];
    console.log($letter);
    
    const letterToCheck = currentWord[index]

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterClass);
  });
  $currentLetter.classList.remove("active","is-last");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];
  if($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active","is-last");
  }
}

const gameOver = () => {
  console.log("Game over")
}

initEvents()
getWords()