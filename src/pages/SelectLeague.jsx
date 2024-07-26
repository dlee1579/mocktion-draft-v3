import { createSearchParams, useNavigate } from "react-router-dom";
import { getAnalytics, logEvent } from "firebase/analytics";

export default function SelectLeague() {
    let navigate = useNavigate();
    const analytics = getAnalytics();

    const leagueSizes = [4, 6, 8, 10, 12, 14, 16, 18, 20];

    const handleSubmit = (event) => {
        event.preventDefault();
        const scoringValue = event.target.scoring.value;
        const teamsValue = event.target.teams.value;
        logEvent(analytics, "select_draft_settings", {
            scoring: scoringValue,
            teams: teamsValue,
        });
        navigate({
            pathname: "draft",
            search: createSearchParams({
                scoring: scoringValue,
                teams: teamsValue,
            }).toString()
        });
    }

    return <>
        <div>
            <h1 className="text-3xl font-bold underline">Mocktion Draft</h1>
            <br></br>
            <h1 className="text-3xl font-bold">🏈🏈</h1>
            <br></br>
            <h2 className="text-md font-bold">A mock draft tool for fantasy football auction drafts</h2>
            <br></br>
            <h3 className="text-xl font-bold underline">Choose your league settings:</h3>
            <br></br>
            <form onSubmit={handleSubmit}>
                <label htmlFor="scoring" className="text-lg">Scoring: </label>
                <select name="scoring" className="text-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option className="text-lg" value="STD">Standard</option>
                    <option className="text-lg" value="HALF">Half PPR</option>
                    <option className="text-lg" value="PPR">Full PPR</option>
                </select>
                <br></br>
                <label htmlFor="league-size" className="text-lg">League Size: </label>
                <select name="teams" className="text-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {leagueSizes.map((size) => (
                        <option className="text-lg" key={size} value={size}>{size}</option>
                    ))}
                </select>
                <br></br>
                <input type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
            </form>
            <a className="text-blue-500 inset-x-0 bottom-0 absolute bottom-0" href="https://github.com/dlee1579/mocktion-draft-v3">DLee's Github</a>
        </div>
    </>
}