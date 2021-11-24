import { waitForDomChange } from "@testing-library/react";
import React from "react";
import Question from "../question/Question";

export default function Quiz() {
  const [data, setData] = React.useState([]);
  const [checkedAnswers, setCheckedAnswers] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isNewGame, setNewGame] = React.useState(false);

  React.useEffect(() => {
    //retrieving data from opentdb
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((quiz) => setData(quiz.results));
  }, [isNewGame]);

  //setRandomAnswers function adds a new prop to each of our questions called randomAnswers. This prop adds all answers in the question object randomly so they are displayed in different order everytime
  function setRandomAnswers(arrData) {
    setData((prevState) => {
      return prevState.map((question) => {
        const randomAnswers = []; //array of indexes to access the anwers in the object question
        const newAllAnswers = []; //randomly generated answers
        const allAnswers = [
          //all the answers in question object
          ...question.incorrect_answers,
          question.correct_answer,
        ];
        //i assign indexes to randomAnswers wich will serve as the random indexes to get the newAllAnswers answers
        for (let i = 0; i < allAnswers.length; i++) {
          randomAnswers.push(i);
        }

        //for each answer in allAnswers we will pick one randomly and push it to newAllAnswers
        for (let i = 0; i < allAnswers.length; i++) {
          //we select a random index from ransomAnswers length
          const randomIndex = Math.floor(Math.random() * randomAnswers.length);
          //i use the randomIndex variable to access one of the index values in randomAnswers
          const randomValueIndex = randomAnswers[randomIndex];
          //from randomAnswers i erase one of the index values so is not used again so i dont push the same answer to newAllAnswers
          randomAnswers.splice(randomIndex, 1);
          //the randomly selected value is pushed to the newAllAnswers variable wich will be the randomAnswers prop in the question object
          newAllAnswers.push(allAnswers[randomValueIndex]);
        }
        return {
          ...question,
          //random answers created
          randomAnswers: [...newAllAnswers],
        };
      });
    });
  }

  //if our data doesnt have the prop randomAnswers i call setRandomAnswers to create it
  if (!data.every((item) => item.randomAnswers)) {
    setRandomAnswers(data);
  }

  //when the user selects one answer from those availble this function will create the answer prop in our questions data that will hold the value of the answer selected so we can compare it to the correct answer
  function handleClick(id, answerClicked) {
    if (!checkedAnswers) {
      //if the user already pressed the check answers button he will no longer be able to select other answers
      setData((prev) => {
        return prev.map((question) => {
          //if the id and the question match i create the answer prop
          if (question.question === id) {
            return {
              ...question,
              answer: answerClicked,
            };
          } else return question;
        });
      });
    }
  }

  //Once the user has selected all answers and presses the check answers button this function will excecute
  function checkAnswers() {
    if (data.every((val) => val.answer)) {
      //if all questions have the answer property i check the results
      setData((prevState) => {
        return prevState.map((question) => {
          //if the selected answer is different to the correct answer i create a "wrong" prop that will hold the correct answer wich has a further use. The highlight prop is specifically to highlight the chosen answer with green background, therefore all questions will have it
          if (question.answer !== question.correct_answer) {
            return {
              ...question,
              wrong: question.correct_answer,
              highlight: question.answer,
            };
          } else {
            return {
              //if the answer is correct i simply create the highlight prop wich equals the answer. The highlight prop is created to know that a question has pass through the checking answer proccess
              ...question,
              highlight: question.answer,
            };
          }
        });
      });
      setCheckedAnswers(true); //checkedAnswers is set to true to know that the evaluation proccess has ended
    } else {
      //if you dont select all answers an alert message will appear
      alert("You must select an answer for every question");
    }
    //When finishing the evaluation proccess i set the score according to the number of right answers
    setScore(
      data.reduce((acc, item) => {
        let num = 0;
        if (item.correct_answer === item.answer) {
          acc += 1;
        }
        return acc;
      }, 0)
    );
  }
  //the newgame function resets our states to start a new trivia game
  function newGame() {
    setCheckedAnswers(false);
    setScore(0);
    setNewGame((prevState) => !prevState); //isNewGame will make useEffect to fetch data from the trivia api to refresh our question data and remove the properties added
  }

  return (
    <section className="hero">
      {data.length > 0 ? ( //if we dont have data the loading message will appear on screen
        <div>
          {/* rendering all questions */}
          {data.map((question, inx) => (
            <Question key={inx} click={handleClick} question={question} />
          ))}
        </div>
      ) : (
        <h2 className="loading">LOADING...</h2>
      )}

      <div className="checkAnswersContainer">
        {/* if the checking proccess is over i render the score */}
        {checkedAnswers && (
          <p className="score">
            You scored {score}/{data.length} correct answers
          </p>
        )}
        {/* if the checking proccess hasnt started i render the "Check answers" button, if it has, i render the "Play Again" button */}
        {!checkedAnswers ? (
          <button className="checkAnswers" onClick={checkAnswers}>
            Check Answers
          </button>
        ) : (
          <button className="newGame" onClick={newGame}>
            Play again
          </button>
        )}
      </div>
    </section>
  );
}

//API
//https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple

//this is the data format retrieved from the API

// {
//   "response_code": 0,
//   "results": [
//   {
//   "category": "General Knowledge",
//   "type": "multiple",
//   "difficulty": "easy",
//   "question": "What does the &#039;S&#039; stand for in the abbreviation SIM, as in SIM card? ",
//   "correct_answer": "Subscriber",
//   "incorrect_answers": [
//   "Single",
//   "Secure",
//   "Solid"
//   ]
//   },
//   {
//   "category": "General Knowledge",
//   "type": "multiple",
//   "difficulty": "easy",
//   "question": "What alcoholic drink is made from molasses?",
//   "correct_answer": "Rum",
//   "incorrect_answers": [
//   "Gin",
//   "Vodka",
//   "Whisky"
//   ]
//   },
//   {
//   "category": "General Knowledge",
//   "type": "multiple",
//   "difficulty": "easy",
//   "question": "According to Sherlock Holmes, &quot;If you eliminate the impossible, whatever remains, however improbable, must be the...&quot;",
//   "correct_answer": "Truth",
//   "incorrect_answers": [
//   "Answer",
//   "Cause",
//   "Source"
//   ]
//   },
//   {
//   "category": "General Knowledge",
//   "type": "multiple",
//   "difficulty": "easy",
//   "question": "What do the letters of the fast food chain KFC stand for?",
//   "correct_answer": "Kentucky Fried Chicken",
//   "incorrect_answers": [
//   "Kentucky Fresh Cheese",
//   "Kibbled Freaky Cow",
//   "Kiwi Food Cut"
//   ]
//   },
//   {
//   "category": "General Knowledge",
//   "type": "multiple",
//   "difficulty": "easy",
//   "question": "According to the nursery rhyme, what fruit did Little Jack Horner pull out of his Christmas pie?",
//   "correct_answer": "Plum",
//   "incorrect_answers": [
//   "Apple",
//   "Peach",
//   "Pear"
//   ]
//   }
//   ]
//   }
