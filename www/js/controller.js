angular.module('starter.controllers', [])
    .controller('LoginCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', '$window', function($scope, $state, UserService, $ionicHistory, $window) {
        $scope.user = {};

        var rememberMeValue;
        if ($window.localStorage["rememberMe"] === undefined ||
            $window.localStorage["rememberMe"] == "true") {
            rememberMeValue = true;
        }
        else {
            rememberMeValue = false;
        }

        $scope.checkbox = {
            rememberMe: rememberMeValue
        };

        if ($window.localStorage["username"] !== undefined && rememberMeValue === true) {
            $scope.user.email = $window.localStorage["username"];
        }

        $scope.loginSubmitForm = function(form) {
            if (form.$valid) {
                UserService.login($scope.user)
                    .then(function(response) {
                        if (response.status === 200) {
                            //Should return a token
                            console.log(response);
                            $window.localStorage['userID'] = response.data.userId;
                            $window.localStorage['token'] = response.data.id;
                            $ionicHistory.nextViewOptions({
                                historyRoot: true,
                                disableBack: true
                            });
                            $state.go('lobby');
                            $window.localStorage["rememberMe"] = $scope.checkbox.rememberMe;
                            if ($scope.checkbox.rememberMe) {
                                $window.localStorage["username"] = $scope.user.email;
                            }
                            else {
                                delete $window.localStorage["username"];
                                $scope.user.email = "";
                            }
                            $scope.user.password = "";
                            form.$setPristine();
                        }
                        else {
                            // invalid response
                            alert("Something went wrong, try again.");
                        }
                    }, function(response) {
                        // Code 401 corresponds to Unauthorized access, in this case, the email/password combination was incorrect.
                        if (response.status === 401) {
                            alert("Incorrect username or password");
                        }
                        else if (response.data === null) {
                            //If the data is null, it means there is no internet connection.
                            alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                        }
                        else {
                            alert("Something went wrong, try again.");
                        }
                    });
            }
        };
    }])

.controller('RegisterCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', '$window', function($scope, $state, UserService, $ionicHistory, $window) {
    $scope.user = {};
    $scope.repeatPassword = {};

    function resetFields() {
        $scope.user.email = "";
        $scope.user.firstName = "";
        $scope.user.lastName = "";
        $scope.user.organization = "";
        $scope.user.password = "";
        $scope.repeatPassword.password = "";
    }

    $scope.registerSubmitForm = function(form) {
        if (form.$valid) {
            if ($scope.user.password != $scope.repeatPassword.password) {
                alert("Passwords must match");
            }
            else {
                UserService.create($scope.user)
                    .then(function(response) {
                        if (response.status === 200) {
                            loginAfterRegister();
                            form.$setPristine();
                        }
                        else {
                            // invalid response
                            alert("Something went wrong, try again.");
                        }
                    }, function(response) {
                        // Code 401 corresponds to Unauthorized access, in this case, the email/password combination was incorrect.
                        if (response.status === 401) {
                            alert("Incorrect username or password");
                        }
                        else if (response.status === 422) {
                            // invalid sresponse
                            alert("Email has already been registered. Use a different email, or log in.");
                        }
                        else if (response.data === null) {
                            //If the data is null, it means there is no internet connection.
                            alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                        }
                        else {
                            alert("Something went wrong, try again.");
                        }
                    });
            }
        }
    };

    //Required to get the access token
    function loginAfterRegister() {
        UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    //Should return a token
                    $window.localStorage["userID"] = response.data.userId;
                    $window.localStorage['token'] = response.data.id;
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                    $state.go('lobby');
                }
                else {
                    // invalid response
                    $state.go('landing');
                }
                resetFields();
            }, function(response) {
                // something went wrong
                console.log(response);
                $state.go('landing');
                resetFields();
            });
    }
}])

.controller('LobbyCtrl', ['$scope', '$state', '$ionicHistory', 'UserService', '$window', 'ServerQuestionService', 'TKQuestionsService', 'TKAnswersService',
    function($scope, $state, $ionicHistory, UserService, $window, ServerQuestionService, TKQuestionsService, TKAnswersService) {
        //Get Questions Initially if they are not already stored
        TKAnswersService.resetAnswers();

        if (TKQuestionsService.questionsLength() === 0) {
            getQuestions();
        }

        function getQuestions() {
            ServerQuestionService.all($window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        var questions = response.data;
                        TKQuestionsService.setQuestions(questions);
                    }
                    else {
                        // invalid response
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    confirmPrompt();
                });
        }

        function confirmPrompt() {
            var response = confirm("The questions could not be retrieved at this time, do you want to try again?");
            if (response == true) {
                getQuestions();
            }
        }
        $scope.takeTestButtonTapped = function() {
            if (TKQuestionsService.questionsLength() === 0) {
                getQuestions();
            }
            else {
                $state.go('test.detail', {
                    testID: 1
                });
            }
        };
        $scope.logout = function() {
            UserService.logout($window.localStorage.token)
                .then(function(response) {
                    //The successful code for logout is 204
                    if (response.status === 204) {
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableBack: true
                        });
                        $state.go('landing');
                    }
                    else {
                        alert("Could not logout at this moment, try again.");
                    }
                }, function(response) {
                    alert("Could not logout at this moment, try again.");
                });
        };

    }
])

.controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state', '$window', 'TKQuestionsService', 'TKAnswersService', 'ServerAnswersService', '$ionicHistory', 'TKResultsButtonService',
    function($scope, testInfo, $stateParams, $state, $window, TKQuestionsService, TKAnswersService, ServerAnswersService, $ionicHistory, TKResultsButtonService) {
        //testInfo is passed in the router to obtain the questions
        var qNumber = $stateParams.testID;
        $scope.title = "Question #" + qNumber;
        testInfo.forEach(function(infoDict) {
            if (infoDict.Answer_ID === "A")
                $scope.questionA = infoDict;
            if (infoDict.Answer_ID === "B")
                $scope.questionB = infoDict;
        });
        $scope.buttonClicked = function(option) {
            var category = $scope["question" + option].Style;
            TKAnswersService.saveAnswer(qNumber, category, option);

            var nextqNumber = Number(qNumber) + 1;
            if (nextqNumber > 30) {
                performRequest();
            }
            else {
                $state.go('test.detail', {
                    testID: nextqNumber
                });
            }
        };

        function performRequest() {
            var answersDict = angular.copy(TKAnswersService.getAnswers());

            answersDict["userID"] = $window.localStorage['userID'];

            var date = new Date();

            answersDict["createDate"] = date.toUTCString();

            ServerAnswersService.create(answersDict, $window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('results');
                        TKResultsButtonService.setShouldShowMenuButton(true);
                    }
                    else {
                        // invalid response
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    confirmPrompt();
                });
        }

        function confirmPrompt() {
            var response = confirm("The answers could not be saved at the moment, do you want to try again?");
            if (response == true) {
                performRequest();
            }
            else {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('results');
                TKResultsButtonService.setShouldShowMenuButton(true);
            }
        }

        $scope.$on("$ionicView.beforeEnter", function() {
            var lastQuestionNumber = TKAnswersService.getLastQuestionNumber();
            if (parseInt(qNumber) < lastQuestionNumber) {
                TKAnswersService.setLastQuestionNumber(lastQuestionNumber - 1);
                TKAnswersService.eraseLastAnswer();
            }
            TKAnswersService.setLastQuestionNumber(parseInt(qNumber));
        });
    }
])

.controller('ResultsCtrl', ['$scope', 'TKAnswersService', '$ionicHistory', '$state', 'TKResultsButtonService',
    function($scope, TKAnswersService, $ionicHistory, $state, TKResultsButtonService) {
        var answersInfo = TKAnswersService.getAnswers();

        function returnPercentage(value) {
            return (value / 12) * 100;
        }

        $scope.menuButtonTapped = function() {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true
            });
            $state.go('lobby');
        };

        $scope.shouldShowButton = TKResultsButtonService.getShouldShowMenuButton();

        $scope.data = [
            [returnPercentage(answersInfo["competing"]), returnPercentage(answersInfo["collaborating"]),
                returnPercentage(answersInfo["compromising"]), returnPercentage(answersInfo["avoiding"]), returnPercentage(answersInfo["accommodating"])
            ]
        ];

        $scope.labels = [
            "Competing",
            "Collaborating",
            "Compromising",
            "Avoiding",
            "Accommodating"
        ];

        $scope.options = {
            scaleIntegersOnly: true,
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scaleOverride: true,
            scaleSteps: 4,
            scaleStepWidth: 25,
            scaleStartValue: 0,
            scaleLabel: "<%=value%>" + "%",
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(0) %>" + "%",
        };

        $scope.colours = [{
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(15,187,25,1)",
            pointColor: "rgba(15,187,25,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,0.8)"
        }];
    }
])

.controller('HistoryCtrl', ['$scope', 'ServerAnswersService', '$window', '$state', 'TKAnswersService', 'TKResultsButtonService',
    function($scope, ServerAnswersService, $window, $state, TKAnswersService, TKResultsButtonService) {
        $scope.tests = [];
        performRequest();
        $scope.goToResult = function(test) {
            var answers = {
                "competing": test.competing,
                "collaborating": test.collaborating,
                "compromising": test.compromising,
                "avoiding": test.avoiding,
                "accommodating": test.accommodating
            };
            TKAnswersService.setAnswers(answers);
            TKResultsButtonService.setShouldShowMenuButton(false);
            $state.go('results');
        };

        function performRequest() {
            ServerAnswersService.all($window.localStorage['userID'],
                    $window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        $scope.tests = response.data;
                    }
                    else {
                        //invalid
                        confirmPrompt();
                    }
                }, function(response) {
                    //something went wrong
                    console.log(response);
                    confirmPrompt();

                });
        }

        function confirmPrompt() {
            var response = confirm("The tests could not be retrieved at the momemt. Do you want to try again?");
            if (response == true) {
                performRequest();
            }
        }
    }
]);