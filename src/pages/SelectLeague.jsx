import { createSearchParams, useNavigate } from "react-router-dom";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Label, TextInput } from "flowbite-react";
import { useState } from "react";

export default function SelectLeague() {
    const [sleeperAuctionDrafts, setSleeperAuctionDrafts] =  useState([]);
    let navigate = useNavigate();
    const analytics = getAnalytics();

    const handleSubmit = (event) => {
        event.preventDefault();

        const platformValue = event.target.platform.value;
        logEvent(analytics, "select_draft_settings", {
            platform: platformValue
        });
        navigate({
            pathname: "draft",
            search: createSearchParams({
                platform: platformValue,
            }).toString()
        });
    };

    const handleSleeperUsernameSubmit = async (event) => {
        event.preventDefault();

        const sleeperUsername = event.target.username.value;
        const getUserByUsernameUrl = `https://api.sleeper.app/v1/user/${sleeperUsername}`;
        const userResponse = await fetch(getUserByUsernameUrl);
        const userJson = await userResponse.json()
        console.log(userJson);

        if (userJson) {
            const userId = userJson.user_id;
            const getDraftsByUserIdUrl = `https://api.sleeper.app/v1/user/${userId}/drafts/nfl/2023`;
            const draftsResponse = await fetch(getDraftsByUserIdUrl);
            const draftsJson = await draftsResponse.json();
            console.log(draftsJson);
            setSleeperAuctionDrafts(draftsJson.filter((draft) => (draft.type === "auction")));
        }
    }

    return <>
        <div className="h-full">
            <h1 className="text-3xl font-bold underline">Mocktion Draft</h1>
            <br></br>
            <h1 className="text-3xl font-bold">🏈🏈</h1>
            <br></br>
            <h2 className="text-md font-bold">A mock draft tool for fantasy football auction drafts</h2>
            <br></br>
            <h3 className="text-xl font-bold underline">Choose your league settings:</h3>
            <br></br>
            <form id="select-platform" onSubmit={handleSubmit}>
                <label htmlFor="platform" className="text-lg">Platform: </label>
                <select name="platform" className="text-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option className="text-lg" value="ESPN">ESPN</option>
                    <option className="text-lg" value="NFL-com">NFL.com</option>
                    <option className="text-lg" value="Yahoo">Yahoo</option>
                </select>
                <br></br>
                <input type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
            </form>
            {/* <form id="add-sleeper-username" className="pt-10" onSubmit={handleSleeperUsernameSubmit}>
                <h1>OR Import auction values from a Sleeper draft from last year</h1>
                <br></br>
                <div className="flex justify-between">
                    <Label htmlFor="username">Sleeper Username</Label>
                    <TextInput className="pb-4" name="username" onChange/>
                    <input type="submit" className='text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 py-1 px-1 rounded'/>
                </div>
            </form>
            {sleeperAuctionDrafts && sleeperAuctionDrafts.map((draft) => (
                <div key={draft.draft_id}>
                    <p>{draft.metadata.name} - {draft.season}</p>
                </div>
            ))} */}
            <a className="text-blue-500 inset-x-0 bottom-0 absolute bottom-0" href="https://github.com/dlee1579/mocktion-draft-v3">DLee's Github</a>
        </div>
    </>
}