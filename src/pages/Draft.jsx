import { getAnalytics, logEvent } from 'firebase/analytics';
import { useState, useEffect } from 'react'
// import auctionValues from "../assets/fantasy-auction-values-2024.json";
import { useSearchParams, useNavigate } from 'react-router-dom';


export default function Draft() {
    const analytics = getAnalytics();
    // auctionValues.sort((a, b) => b.Price - a.Price)
    const [currentAvailablePlayers, setCurrentAvailablePlayers] = useState([]);
    const [roster, setRoster] = useState([]);
    const [hideRoster, setHideRoster] = useState(true);
    const [filterPosition, setFilterPosition] = useState("ALL");
    const [searchParams, setSearchParams] = useSearchParams();
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
            paddingTop: 60,
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
        console.log(roster);
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
            currentSpend += player.Price
        });
        return 200 - currentSpend;
    }

    const handleRemovePlayerFromRoster = (targetPlayer) => {
        logEvent(analytics, "remove_player_from_roster", {
            player: targetPlayer.Overall,
        });
        setRoster(roster.filter((player) => player !== targetPlayer));
    }

    const isOnRoster = (player) => {
        return roster.includes(player);
    }

    const renderStartingLineup = () => {
        const QBs = roster.filter((player) => player.Position === 'QB');
        const RBs = roster.filter((player) => player.Position === "RB");
        const WRs = roster.filter((player) => player.Position === "WR");
        const TEs = roster.filter((player) => player.Position === "TE");
        const Ks = roster.filter((player) => player.Position === "K");
        const DSTs = roster.filter((player) => player.Position === "DST");

        QBs.sort((a, b) => b.Price - a.Price);
        RBs.sort((a, b) => b.Price - a.Price);
        WRs.sort((a, b) => b.Price - a.Price);
        TEs.sort((a, b) => b.Price - a.Price);
        Ks.sort((a, b) => b.Price - a.Price);
        DSTs.sort((a, b) => b.Price - a.Price);

        let QB1 = QBs ? QBs[0] : null;
        let RB1 = RBs ? RBs[0] : null;
        let RB2 = RBs.length > 1 ? RBs[1] : null;
        let WR1 = WRs ? WRs[0] : null;
        let WR2 = WRs.length > 1 ? WRs[1] : null;
        let TE1 = TEs ? TEs[0] : null;
        let K1 = Ks ? Ks[0] : null;
        let DST1 = DSTs ? DSTs[0] : null;

        const getFlex = () => {
            // FLEX can be RB, WR, or TE
            let potentialFlexes = [];
            if (RBs.length > 2) {
                potentialFlexes.push(RBs[2]);
            }
            if (WRs.length > 2) {
                potentialFlexes.push(WRs[2]);
            }
            if (TEs.length > 1) {
                potentialFlexes.push(TEs[1]);
            }

            return potentialFlexes.reduce((prev, current) => (prev && prev.Price > current.Price) ? prev : current, null)
        }
        const getBench = () => {
            return roster.filter((player) =>
                player !== QB1 &&
                player !== RB1 &&
                player !== RB2 &&
                player !== WR1 &&
                player !== WR2 &&
                player !== TE1 &&
                player !== getFlex() &&
                player !== K1 &&
                player !== DST1
            )
        }
        return <>
            <div className='justify-evenly'>
                <table id="starting-lineup" className="table-fixed items-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <thead>
                        <tr>
                            <th className='w-1/4'>Position</th>
                            <th className='w-3/5'>Player</th>
                            <th className='w-1/8'></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>QB</td>
                            <td>
                                {QB1 && `${QB1.Overall}: ${QB1.Value}`}
                            </td>
                            <td>
                                {QB1 && <button onClick={() => handleRemovePlayerFromRoster(QB1)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>RB</td>
                            <td>
                                {RB1 && `${RB1.Overall}: ${RB1.Value}`}
                            </td>
                            <td>
                                {RB1 && <button onClick={() => handleRemovePlayerFromRoster(RB1)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>RB</td>
                            <td>
                                {RB2 && `${RB2.Overall}: ${RB2.Value}`}
                            </td>
                            <td>
                                {RB2 && <button onClick={() => handleRemovePlayerFromRoster(RB2)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>WR</td>
                            <td>
                                {WR1 && `${WR1.Overall}: ${WR1.Value}`}
                            </td>
                            <td>
                                {WR1 && <button onClick={() => handleRemovePlayerFromRoster(WR1)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>WR</td>
                            <td>
                                {WR2 && `${WR2.Overall}: ${WR2.Value}`}
                            </td>
                            <td>
                                {WR2 && <button onClick={() => handleRemovePlayerFromRoster(WR2)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>TE</td>
                            <td>
                                {TE1 && `${TE1.Overall}: ${TE1.Value}`}
                            </td>
                            <td>
                                {TE1 && <button onClick={() => handleRemovePlayerFromRoster(TE1)} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>FLEX</td>
                            <td>
                                {getFlex() && `${getFlex().Overall}: ${getFlex().Value}`}
                            </td>
                            <td>
                                {getFlex() && <button onClick={() => handleRemovePlayerFromRoster(getFlex())} style={styles.removeCurrentRosterPlayerButton}>X</button>}
                            </td>
                        </tr>
                        <tr>
                            <td>K</td>
                            {K1 &&
                                <>
                                    <td>{K1.Overall}: {K1.Value}</td>
                                    <td><button onClick={() => handleRemovePlayerFromRoster(K1)} style={styles.removeCurrentRosterPlayerButton}>X</button></td>
                                </>
                            }
                        </tr>
                        <tr>
                            <td>DST</td>
                            {DST1 &&
                                <>
                                    <td>${DST1.Overall}: ${DST1.Value}</td>
                                    <td><button onClick={() => handleRemovePlayerFromRoster(DST1)} style={styles.removeCurrentRosterPlayerButton}>X</button></td>
                                </>}
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 1 && `${getBench()[0].Overall}: ${getBench()[0].Value}`}</td>
                            <td>{getBench().length >= 1 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[0])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 2 && `${getBench()[1].Overall}: ${getBench()[1].Value}`}</td>
                            <td>{getBench().length >= 2 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[1])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 3 && `${getBench()[2].Overall}: ${getBench()[2].Value}`}</td>
                            <td>{getBench().length >= 3 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[2])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 4 && `${getBench()[3].Overall}: ${getBench()[3].Value}`}</td>
                            <td>{getBench().length >= 4 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[3])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 5 && `${getBench()[4].Overall}: ${getBench()[4].Value}`}</td>
                            <td>{getBench().length >= 5 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[4])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                        <tr>
                            <td>BCH</td>
                            <td>{getBench().length >= 6 && `${getBench()[5].Overall}: ${getBench()[5].Value}`}</td>
                            <td>{getBench().length >= 6 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[5])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    }

    const handleChangeFilterPosition = (event) => {
        setFilterPosition(event.target.value);
        console.log(event.target.value);
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
                <div>
                    <p>Remaining Budget: {getRemainingBudget()}</p>
                </div>
                <br></br>
                <label htmlFor="filter-position" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Filter by Position</label>
                <select id="filter-position" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={filterPosition} onChange={handleChangeFilterPosition}>
                    <option value="ALL">ALL</option>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="TE">TE</option>
                    <option value="FLEX">W/R/T</option>
                    <option value="K">K</option>
                    <option value="DST">DST</option>
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
                <button onClick={handleViewRosterClick} className='bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={styles.viewRosterButton}>View Current Roster</button>
            </div>
            {!hideRoster && <div style={styles.currentRosterFlyout} id="current-roster-flyout">
                <p>Remaining Budget: {getRemainingBudget()}</p>
                <br></br>
                <button className='bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleResetRosterClick}>Reset Roster</button>
                <br></br>
                <br></br>
                {renderStartingLineup()}
                <div>
                </div>
                <div style={styles.viewAvailablePlayersButtonDiv}>
                    <button className='bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleViewAvailablePlayersClick}>View Available Players</button>
                </div>
                
                <p className="pt-20">Take a screenshot of your team!</p>
            </div>}

        </>
    )
}