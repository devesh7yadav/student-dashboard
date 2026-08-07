import styles from "../Styles";

function Home() {

    return(
        <div className="p-20">
            <div className="border-[#74A2BE] border-2 rounded-md">
                <p className={styles.homeText}>
                    Track each of your course grades in the Courses & Grades section. Add your courses and view your grades in the gradebook.
                </p>

                <p className={styles.homeText}>
                    Track all of your assignments using the Assignments section. Customize each assignment with its own information, and view completed assignments in a separate table.
                </p>

                <p className={styles.homeText}>
                    Calculate your average using the Average Grade Calculator under the Calculators section. Find out what exam mark you need to achieve a certain grade with the Exam Grade Calculator.
                    Predict your final grade using the Grade Predictor Calculator.
                </p>
            </div>
        </div>
    )
}

export default Home;