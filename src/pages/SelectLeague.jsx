import { createSearchParams, useNavigate } from "react-router-dom";

export default function SelectLeague() {
    let navigate = useNavigate();

    const leagueSizes = [4, 6, 8, 10, 12, 14, 16, 18, 20];

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(event);
        navigate({
            pathname: "draft",
            search: createSearchParams({
                scoring: event.target.scoring.value,
                teams: event.target.teams.value,
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
                <label htmlFor="scoring">Scoring: </label>
                <select name="scoring" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="STD">Standard</option>
                    <option value="HALF">Half PPR</option>
                    <option value="PPR">Full PPR</option>
                </select>
                <label htmlFor="league-size">League Size: </label>
                <select name="teams" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {leagueSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <br></br>
                <input type="submit" className='bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
            </form>
        </div>
    </>
}