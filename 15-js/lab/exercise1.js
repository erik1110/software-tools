
function bmi(weight, height) {
    let bmiValue = Math.round(weight / (height ** 2), 1);
    console.log("BMI:", bmiValue);
    if (bmiValue < 18.5) {
        return "Underweight";
    } else if (bmiValue <= 24.9) {
        return "Normal";
    } else if (bmiValue <= 29.9) {
        return "Overweight";
    } else if (bmiValue <= 39.9) {
        return "Obese";
    } else {
        return "Severely Obese";
    }
}

console.log(bmi(1400, 15.65));