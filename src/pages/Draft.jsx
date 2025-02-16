import { getAnalytics, logEvent } from 'firebase/analytics';
import { useState, useEffect } from 'react'
// import auctionValues from "../assets/fantasy-auction-values-2024.json";
import { useSearchParams, useNavigate } from 'react-router-dom';
import StartingLineup from '../components/StartingLineup';
import { RangeSlider } from 'flowbite-react';


export default function Draft() {
    const analytics = getAnalytics();
    // auctionValues.sort((a, b) => b.price - a.price)
    const [currentAvailablePlayers, setCurrentAvailablePlayers] = useState([]);
    const [roster, setRoster] = useState([]);
    const [hideRoster, setHideRoster] = useState(true);
    const [filterPosition, setFilterPosition] = useState("ALL");
    const [searchParams, setSearchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const [filterPrice, setFilterPrice] = useState(200);
    const navigate = useNavigate();
    useEffect(()=> {
        if (searchParams.has('platform')) {
            import(`../data/fantasy-auction-values-2024-${searchParams.get("platform")}.json`)
                .then((res) => {
                    let temp = res.default;
                    temp.sort((a,b) => b.price - a.price);
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
            // width: '50%',
            margin: "auto",
            opacity: 1,
            backgroundColor: '#242424',
            zIndex: 5,
            paddingBottom: 10,
            justifyContent: 'center'
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

    const getPlayerOverallText = (player) => {
        return `${player.name} (${player.team} - ${player.position})`
    }

    const handleAvailablePlayerClick = (targetPlayer) => {
        // toggle behavior: if player is on roster, remove them. if player is not on roster, add them
        if (isOnRoster(targetPlayer)) {
            logEvent(analytics, "remove_player_from_roster", {
                player: getPlayerOverallText(targetPlayer),
            });
            setRoster(roster.filter((player) => player !== targetPlayer));
        } else {
            logEvent(analytics, "add_player_to_roster", {
                player: getPlayerOverallText(targetPlayer),
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
            currentSpend += player.price;
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
            } else if (filterPosition === "QB" && player.position === "QB") {
                return true;
            } else if (filterPosition === "RB" && player.position === "RB") {
                return true;
            } else if (filterPosition === "WR" && player.position === "WR") {
                return true;
            } else if (filterPosition === "TE" && player.position === "TE") {
                return true;
            } else if (filterPosition === "FLEX" && (player.position === "RB" || player.position === "WR" || player.position === "TE")) {
                return true;
            } else if (filterPosition === "K" && player.position === "K") {
                return true;
            } else if (filterPosition === "DST" && player.position === "DST") {
                return true;
            } else {
                return false;
            }
        }
        return currentAvailablePlayers.filter(isPlayerPosition).filter((player) => (player.price <= filterPrice));
    }

    const handleResetRosterClick = () => {
        logEvent(analytics, "reset_roster");
        setRoster([]);
    }

    const handlePriceRangeSliderChange = (event) => {
        setFilterPrice(event.target.value);
    }

    return (
        <>
            <div className="w-screen">
            <div id="sticky-header" style={styles.stickyHeader} className="max-w-72 justify-center">
                <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
                <h1 className="text-md font-bold underline pt-10">
                    Mocktion Draft
                </h1>
                <br></br>

                <div>
                    <p>Remaining Budget: {getRemainingBudget()}</p>
                </div>
                <br></br>
                <label htmlFor="filter-position" className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Filter by Position</label>
                <select id="filter-position" className="text0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={filterPosition} onChange={handleChangeFilterPosition}>
                    <option className="text-lg" value="ALL">ALL</option>-lg bg-gray-5
                    <option className="text-lg" value="QB">QB</option>
                    <option className="text-lg" value="RB">RB</option>
                    <option className="text-lg" value="WR">WR</option>
                    <option className="text-lg" value="TE">TE</option>
                    <option className="text-lg" value="FLEX">W/R/T</option>
                    <option className="text-lg" value="K">K</option>
                    <option className="text-lg" value="DST">DST</option>
                </select>
                <div id="price-filter" className='pt-3 justify-center'>
                    <p>Set Filter Price: {filterPrice}</p>
                    <RangeSlider className='pt-4' sizing="xl" min={1} max={200} onChange={handlePriceRangeSliderChange} value={filterPrice}/>
                </div>
            </div>
            <div style={styles.currentAvailablePlayers} id="current-available-players">
                {filteredAvailablePlayers().map((player) => (
                    <div onClick={() => handleAvailablePlayerClick(player)} style={styles.availablePlayer} key={player.id}>
                        <p>{getPlayerOverallText(player)}: ${player.price} {isOnRoster(player) && <span style={{ color: '#AAFF00' }}>&#10003;</span>}</p>
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
            </div>
        </>
    )
}