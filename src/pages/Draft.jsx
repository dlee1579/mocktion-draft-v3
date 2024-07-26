import { getAnalytics, logEvent } from 'firebase/analytics';
import { useState, useEffect } from 'react'
// import auctionValues from "../assets/fantasy-auction-values-2024.json";
import { useSearchParams, useNavigate } from 'react-router-dom';
import StartingLineup from '../components/StartingLineup';


export default function Draft() {
    const analytics = getAnalytics();
    // auctionValues.sort((a, b) => b.Price - a.Price)
    const [currentAvailablePlayers, setCurrentAvailablePlayers] = useState([]);
    const [roster, setRoster] = useState([]);
    const [hideRoster, setHideRoster] = useState(true);
    const [filterPosition, setFilterPosition] = useState("ALL");
    const [searchParams, setSearchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    useEffect(()=> {
        if (searchParams.has('scoring') && searchParams.has('teams')) {
            import(`../data/fantasy-auction-values-2024-${searchParams.get("scoring")}-${searchParams.get("teams")}-teams-200-budget.json`)
                .then((res) => {
                    let temp = res.default;
                    temp.sort((a,b) => b.Price - a.Price);
                    setCurrentAvailablePlayers(res.default);
                })
        }
    }, [])

    const styles = {
        currentAvailablePlayers: {
            paddingTop: 20,
            position: "relative",
            paddingBottom: 40,
        },
        availablePlayer: {
            padding: 6,
        },
        stickyHeader: {
            position: 'sticky',
            top: 0,
            left: 0,
            alignItems: 'center',
            width: '100%',
            opacity: 1,
            backgroundColor: '#242424',
            zIndex: 5,
            paddingBottom: 10,
            // height: 400,
        },
        viewRosterButtonDiv: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            alignItems: 'center',
            width: '100%',
            opacity: 1,
            backgroundColor: '#242424',
            paddingTop: 10,
            paddingBottom: 10,
            // paddingVertical: 10,
        },
        viewRosterButton: {
            // backgroundColor: 'blue',
            textAlign: 'center',
            left: '50%',
        },
        currentRosterFlyout: {
            width: "100%",
            height: "100%",
            zIndex: 10,
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: '#242424',
            // alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 30,
        },
        currentRosterPlayer: {
            display: "inline"
        },
        removeCurrentRosterPlayerButton: {
            fontWeight: "bold"
        },
        viewAvailablePlayersButtonDiv: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            alignItems: 'center',
            width: '100%',
            opacity: 1,
            backgroundColor: '#242424',
            zIndex: 100,
            paddingTop: 10,
            paddingBottom: 10,
        },
        backButton: {
            left: 20,
            top: 20,
            position: 'fixed',
            fontSize: 25,
        }
    }

    const handleViewRosterClick = () => {
        // console.log(roster);
        setHideRoster(false);
    }

    const handleAvailablePlayerClick = (targetPlayer) => {
        // toggle behavior: if player is on roster, remove them. if player is not on roster, add them
        if (isOnRoster(targetPlayer)) {
            logEvent(analytics, "remove_player_from_roster", {
                player: targetPlayer.Overall,
            });
            setRoster(roster.filter((player) => player !== targetPlayer));
        } else {
            logEvent(analytics, "add_player_to_roster", {
                player: targetPlayer.Overall,
            });
            setRoster([...roster, targetPlayer]);
        }
    }

    const handleViewAvailablePlayersClick = () => {
        setHideRoster(true);
    }

    const getRemainingBudget = () => {
        let currentSpend = 0;
        roster.forEach((player) => {            
            currentSpend += player.Price;
        });
        return 200 - currentSpend;
    }

    const isOnRoster = (targetPlayer) => {
        return roster.map((player) => player.id).includes(targetPlayer.id);
    }

    const handleChangeFilterPosition = (event) => {
        setFilterPosition(event.target.value);
    }
    const filteredAvailablePlayers = () => {
        const isPlayerPosition = (player) => {
            if (filterPosition === "ALL") {
                return true;
            } else if (filterPosition === "QB" && player.Position === "QB") {
                return true;
            } else if (filterPosition === "RB" && player.Position === "RB") {
                return true;
            } else if (filterPosition === "WR" && player.Position === "WR") {
                return true;
            } else if (filterPosition === "TE" && player.Position === "TE") {
                return true;
            } else if (filterPosition === "FLEX" && (player.Position === "RB" || player.Position === "WR" || player.Position === "TE")) {
                return true;
            } else if (filterPosition === "K" && player.Position === "K") {
                return true;
            } else if (filterPosition === "DST" && player.Position === "DST") {
                return true;
            } else {
                return false;
            }
        }
        return currentAvailablePlayers.filter(isPlayerPosition);
    }

    const handleResetRosterClick = () => {
        logEvent(analytics, "reset_roster");
        setRoster([]);
    }

    return (
        <>
            <div id="sticky-header" style={styles.stickyHeader}>
                <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
                <h1 className="text-3xl font-bold underline pt-10">
                    Mocktion Draft
                </h1>
                <br></br>
                <p>All values taken from <a className="text-blue-500" href="https://draftwizard.fantasypros.com/auction/fp_nfl.jsp">FantasyPros Draft Calculator</a></p>
                <br></br>
                <div>
                    <p>Remaining Budget: {getRemainingBudget()}</p>
                </div>
                <br></br>
                <label htmlFor="filter-position" className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Filter by Position</label>
                <select id="filter-position" className="text-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={filterPosition} onChange={handleChangeFilterPosition}>
                    <option className="text-lg" value="ALL">ALL</option>
                    <option className="text-lg" value="QB">QB</option>
                    <option className="text-lg" value="RB">RB</option>
                    <option className="text-lg" value="WR">WR</option>
                    <option className="text-lg" value="TE">TE</option>
                    <option className="text-lg" value="FLEX">W/R/T</option>
                    <option className="text-lg" value="K">K</option>
                    <option className="text-lg" value="DST">DST</option>
                </select>
            </div>
            <div style={styles.currentAvailablePlayers} id="current-available-players">
                {filteredAvailablePlayers().map((player) => (
                    <div onClick={() => handleAvailablePlayerClick(player)} style={styles.availablePlayer} key={player.id}>
                        <p>{player.Overall}: {player.Value} {isOnRoster(player) && <span style={{ color: '#AAFF00' }}>&#10003;</span>}</p>
                    </div>
                ))}
            </div>
            <div style={styles.viewRosterButtonDiv}>
                <button onClick={handleViewRosterClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={styles.viewRosterButton}>View Current Roster</button>
            </div>
            {!hideRoster && <div style={styles.currentRosterFlyout} id="current-roster-flyout">
                <p>Remaining Budget: {getRemainingBudget()}</p>
                <br></br>
                <button className='bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleResetRosterClick}>Reset Roster</button>
                <br></br>
                <br></br>
                <p className="text-xs">Press Player to Edit Price</p>
                <br></br>
                <StartingLineup roster={roster} setRoster={setRoster} showModal={showModal} setShowModal={setShowModal} currentAvailablePlayers={currentAvailablePlayers} setCurrentAvailablePlayers={setCurrentAvailablePlayers}/>
                <div>
                </div>
                <div style={styles.viewAvailablePlayersButtonDiv}>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleViewAvailablePlayersClick}>View Available Players</button>
                </div>
                
                <p className="pt-10">Take a screenshot of your team!</p>
            </div>}

        </>
    )
}