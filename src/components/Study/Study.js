import React, { Component } from "react";
import UserContext from "../../contexts/UserContext";
import config from "../../config";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

function ListOfWords(props) {
  return (
    <li>
      <h4>{props.word.original}<span> = </span>{props.word.translation}</h4>
      <div>
      </div>
    </li>
  );
}

class Study extends Component {
    static contextType = UserContext;
  generateWordList(words) {
    // set empty array
    let result = [];
    // foreach with param // with word, key
    words.forEach((word, key) => {
      //push to array
      result.push(<ListOfWords key={key} word={word} />);
    });
    // return {result}
    return <p>{result}</p>;
  }

  render() {
    // console.log(this.context);
    return (
      //context.language if/else statement
      <div className="study">
        <h2 className="study-language-header">
          {this.context.language ? this.context.language.name : null}
        </h2>
        <Link to="/learn" className="start-btn">
          <Button className="start-button">Start Practicing</Button>
        </Link>
        <Link to="/" className="start-btn">
          <Button className="start-button">Back To Scores</Button>
        </Link>
        <h3 className="dash-list-title">Words To Practice</h3>
        <div className="word-list">
          {this.context.words
            ? this.generateWordList(this.context.words)
            : null}
        </div>
      </div>
    );
  }
}

export default Study;
