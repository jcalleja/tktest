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
        };
        service.getAnswers = function() {
            return answerCategories;
        };
    });