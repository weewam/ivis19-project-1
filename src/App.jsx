import React, { Component } from 'react';

import './Normalize.css';
import './App.css';

import Chart from './RadarChart';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<header>
      		<h1>Project 1</h1>

      		<div className="p-container">
      		<p>The intention of this project is to provide users with an easy and rather intuitive way into forming groups. Students are represented with circles and clustered into a radar chart with the intention of similar skills being close to each other. However, collision detection has been used in order to prevent students circles from overlapping, therefore the students will not always lie within the center of their polygon.</p>
      		<p>The radius of the student circle is based on the average on their skills, where a larger radius means that the student considered themselves to be more skilled. By hovering a student, the actuals skills of said student is displayed. A student can be added to the current selection by pressing the circle, and removed in a similar manner. In order to form good groups, one should try to evenly cover the various vertices and perhaps grouping people with similar interests.</p>
      		</div>
      	</header>
        <Chart />
      </div>
    );
  }
}

export default App;
