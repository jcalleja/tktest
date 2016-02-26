angular.module('TKServicesModule', [])
    .service('TKQuestionsService', function() {
        var service = this;

        var questions = [];

        service.setQuestions = function(serverQuestions) {
            questions = serverQuestions;
        };
        service.getQuestion = function(questionID) {
            var results = [];
            questions.forEach(function(question) {
                //Search for questions with the specified question ID
                if (question.Question_Number == questionID)
                    results.push(question);
            });
            return results;
        };
        service.questionsLength = function() {
            return questions.length;
        };
    })
    .service('TKAnswersService', function() {
        var service = this;
        var lastQuestionNumber = 0;
        var categoriesStack = [];
        var answerCategories = {
            "competing": 0,
            "collaborating": 0,
            "compromising": 0,
            "avoiding": 0,
            "accommodating": 0
        };
        var answers = {};
        service.saveAnswer = function(questionNumber, answerCategory, option) {
            answerCategories[answerCategory.toLowerCase()]++;
            answers[questionNumber] = option;
            categoriesStack.push(answerCategory);
        };
        service.getAnswers = function() {
            return answerCategories;
        };
        service.setAnswers = function(answers) {
            answerCategories = answers;
        };
        service.resetAnswers = function() {
            for (var property in answerCategories) {
                if (answerCategories.hasOwnProperty(property)) {
                    answerCategories[property] = 0;
                }
            }
            lastQuestionNumber = 0;
        };
        service.setLastQuestionNumber = function(qNumber) {
            lastQuestionNumber = qNumber;
        };
        service.getLastQuestionNumber = function() {
            return lastQuestionNumber;
        };
        service.eraseLastAnswer = function() {
            answerCategories[categoriesStack.pop().toLowerCase()]--;
        };
    })

.service('TKResultsButtonService', function() {
    var service = this;

    var shouldShowButton = false;

    service.setShouldShowMenuButton = function(show) {
        shouldShowButton = show;
    };

    service.getShouldShowMenuButton = function() {
        return shouldShowButton;
    };
});