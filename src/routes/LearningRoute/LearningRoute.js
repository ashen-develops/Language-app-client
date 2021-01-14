import React from "react";
import TokenService from "../../services/token-service";
import config from "../../config";
import UserContext from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

class LearningRoute extends React.Component {
  static contextType = UserContext;

  state = {
    error: null,
    results: false,
  };
  // add constructor
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }
  componentDidMount() {
    console.log(this.context);
    return fetch(`${config.API_ENDPOINT}/language/head`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.context.setNextWord(res);
      })
      .catch((err) => this.setState({ error: err }));
  }

  // submit form / language/guess fetch request
  submitForm(e) {
    e.preventDefault();

    if (this.state.results) {
      this.setState({ results: !this.state.results });
      setTimeout(
        () => document.getElementById("learn-guess-input").focus(),
        250
      );
    } else {
      this.context.setCurrentWord(this.context.nextWord);
      this.context.setGuess(e.target.userinput.value.charAt(0).toUpperCase() + e.target.userinput.value.slice(1));
      //integral to the input box being hidden
      this.setState({ results: !this.state.results });

      fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({ guess: e.target.userinput.value.charAt(0).toUpperCase() + e.target.userinput.value.slice(1) }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.context.setNextWord(json);
          this.showFeedback();
          document.getElementById("feedback-overlay").focus();
          document.getElementById("learn-guess-input").value = "";
        });
    }
  }

  // feedback if correct/incorrect
  showFeedback() {
    const el = document.getElementById("feedback-overlay");
    el.classList.remove("invisible");
    setTimeout(() => {
      el.classList.add("invisible");
    }, 2500);
  }

  //clearFeedback??
  clearFeedback() {
    document.getElementById("feedback-overlay").classList.add("invisible");
    document.getElementsByClassName("btn")[0].focus();
  }

  //get the response text
  getResponse() {
    if (this.context.nextWord)
      if (typeof this.context.nextWord.isCorrect !== "undefined") {
        if (this.context.nextWord.isCorrect) {
          return "You were correct! :D";
        } else {
          return "Good try, but not quite right :(";
        }
      }
  }

  //'the correct response was'
  getResponseFeedback() {
    if (
      this.context.nextWord &&
      typeof this.context.nextWord.isCorrect !== "undefined"
    ) {
      return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer} and you chose ${this.context.guess}!`;
      
    }
  }

  //get button text - make button 'try another word' or 'submit your answer'
  getButtonText() {
    if (this.state.results) {
      return "Try another word!";
    } else return "Submit your answer";
  }

  render() {
    return (
      <div>
        <h3>Learn Some Finnish</h3>
        <div>or <Link to="/" className="start-btn">
                <Button className="start-button">study some more</Button>
        </Link> </div>
        <h3>Some Useful Pronounciation Tips</h3>
        <ul className="tips">
          <li className="textfield">A: pronounced like the "u" in "cup"</li>
          <li className="textfield">Ä (with umlaut): sounds close to the "a" in "hat"</li>
          <li className="textfield">E: pronounced like "e" in "hen"</li>
          <li className="textfield">I: sounds like "i" in "tip"</li>
          <li className="textfield">
            Y: close to the "u" in the British pronunciation of "you" with tight
            lips
          </li>
          <li className="textfield">
            Ö (with umlaut): pronounced like the "u" in "fur" with tight lips
          </li>
        </ul>
        <h2>Translate the word:</h2>
        <span className="word">
          {this.context.nextWord
            ? this.state.results
              ? this.context.currentWord.nextWord
              : this.context.nextWord.nextWord
            : null}
        </span>

        <h3
          id="feedback-overlay"
          className="invisible"
          onClick={this.clearFeedback}
        >
          {this.getResponse()}
        </h3>
        <div className="DisplayScore">
          <p>
            Your total score is:{" "}
            {this.context.nextWord ? this.context.nextWord.totalScore : null}
          </p>
        </div>
        <div className="DisplayFeedback">
          <p className={this.state.results ? "" : "hidden"}>
            {this.getResponseFeedback()}
          </p>
        </div>
        <form onSubmit={this.submitForm}>
          <label
            htmlFor="learn-guess-input"
            className={this.state.results ? "hidden" : ""}
          >
            What's the translation for this word?
          </label>
          <input
            autoFocus={true}
            id="learn-guess-input"
            name="userinput"
            type="text"
            required={this.state.results ? false : true}
            className={this.state.results ? "hidden" : ""}
            maxLength="25"
          ></input>
          <button className="btn" type="submit">
            {this.getButtonText()}
          </button>
        </form>
        <p className="word-count">
          You have answered this word correctly{" "}
          {this.state.results
            ? this.context.currentWord.wordCorrectCount
            : this.context.nextWord
            ? this.context.nextWord.wordCorrectCount
            : null}{" "}
          times.
        </p>
        <p className="word-count">
          You have answered this word incorrectly{" "}
          {this.state.results
            ? this.context.currentWord.wordIncorrectCount
            : this.context.nextWord
            ? this.context.nextWord.wordIncorrectCount
            : null}{" "}
          times.
        </p>
      </div>
    );
  }
}

export default LearningRoute;
