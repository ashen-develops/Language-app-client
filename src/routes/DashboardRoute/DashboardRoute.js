import React, { Component } from "react";
import UserContext from "../../contexts/UserContext";
import config from "../../config";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

function ListOfWords(props) {
  return (
    <li>
      <h4>{props.word.original}</h4>
      <div className="listCount">
        <div className="textfield">
          <span className="correct-count">
            correct answer count: {props.word.correct_count}
          </span>
        </div>
        <div className="textfield">
          <span className="incorrect-count">
            incorrect answer count: {props.word.incorrect_count}
          </span>
        </div>
      </div>
    </li>
  );
}

class DashboardRoute extends Component {
  //create state
  state = {
    error: null,
  };
  //use context
  static contextType = UserContext;

  //componenet did mount
  //fetch /language
  componentDidMount() {
    return fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        // console.log(this.context)
        this.context.setLanguage(response.language);
        this.context.setWords(response.words);
      })
      .catch((error) => this.setState({ error: error }));
  }

  //function to get list of words
  generateWordList(words) {
    // set empty array
    let result = [];
    // foreach with param // with word, key
    words.forEach((word, key) => {
      //push to array
      result.push(<ListOfWords key={key} word={word} />);
    });
    // return {result}
    return <div>{result}</div>;
  }

  render() {
    // console.log(this.context);
    return (
      //context.language if/else statement
      <div className="dashboard">
        <section>
        <h2 className="dash-language-header">
          {this.context.language ? this.context.language.name : null}
        </h2>
        </section>
        {/* link to learning page w/ button */}
        <section>
        <Link to="/learn" className="start-btn">
          <Button className="start-button">Start practicing</Button>
        </Link>
        {/* <Link to="/study" className="start-btnn">
          <Button className="start-button">Study Up</Button>
        </Link> */}
        </section>
        <section>
          <h3>Words to practice</h3>
        </section>
        <section>
        <div className="word-list">
          {this.context.words
            ? this.generateWordList(this.context.words)
            : null}
        </div>
        </section>
        <section className="total-correct">
          <h4>
            {this.context.language
              ? `Total correct answers: ${this.context.language.total_score}`
              : null}
          </h4>
        </section>
      </div>
    );
  }
}

export default DashboardRoute;
