'use strict';

var curChart;
confirmedCases.onclick = function(element) {
  stateAnalysis();
};

activeDischarged.onclick = function(element) {
  activeAnalysis();
};

hospitalStats.onclick = function(element) {
  hospitalAnalysis();
};

dailyStats.onclick = function(element) {
  dailyAnalysis();
};

ageStats.onclick = function(element) {
  ageAnalysis();
};
