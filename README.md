# Stevan's Trivia Game
Made for SENG 513 (Web-based Systems) Assignment - Trivia Game<br>
A simple geography quiz game wherein the player is asked 10 geography questions and the score is tracked, with questions pulled from the [Open Trivia Database](https://opentdb.com).<br><br>
Hosted on [Cloudflare Pages](https://seng513a2.pages.dev). <br>
![image](https://github.com/stevanbeljic/SENG513A2/blob/main/Screenshot-quizgame.png)

## Implementation
### How to Use
Upon landing, the player is asked to provide their name. Afterwards, 10 questions will be pulled from the database mentioned above, and will be presented to the user one at a time.
If a user gets a question correct, they will be awarded 10 points and their selection will be highlighted green.
If the user selects a wrong answer, no points will be awarded, their selection will be highlighted yellow, and the correct answer will be highlighted green.
Upon completing all 10 questions, the final score will be displayed.

## Competencies Demonstrated
- HTML, CSS, and JavaScript
- Performing GET requests to an API
