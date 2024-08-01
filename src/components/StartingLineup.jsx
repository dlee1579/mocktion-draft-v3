import { getAnalytics, logEvent } from 'firebase/analytics';
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from 'react';

export default function StartingLineup(props) {
    const analytics = getAnalytics();
    const roster = props.roster;
    const setRoster = props.setRoster;
    const showModal = props.showModal;
    const setShowModal = props.setShowModal;
    const currentAvailablePlayers = props.currentAvailablePlayers;
    const setCurrentAvailablePlayers = props.setCurrentAvailablePlayers;

    const [playerToEdit, setPlayerToEdit] = useState(null);
    // console.log(props);
    const QBs = roster.filter((player) => player.position === 'QB');
    const RBs = roster.filter((player) => player.position === "RB");
    const WRs = roster.filter((player) => player.position === "WR");
    const TEs = roster.filter((player) => player.position === "TE");
    const Ks = roster.filter((player) => player.position === "K");
    const DSTs = roster.filter((player) => player.position === "DST");

    QBs.sort((a, b) => b.price - a.price);
    RBs.sort((a, b) => b.price - a.price);
    WRs.sort((a, b) => b.price - a.price);
    TEs.sort((a, b) => b.price - a.price);
    Ks.sort((a, b) => b.price - a.price);
    DSTs.sort((a, b) => b.price - a.price);

    let QB1 = QBs ? QBs[0] : null;
    let RB1 = RBs ? RBs[0] : null;
    let RB2 = RBs.length > 1 ? RBs[1] : null;
    let WR1 = WRs ? WRs[0] : null;
    let WR2 = WRs.length > 1 ? WRs[1] : null;
    let TE1 = TEs ? TEs[0] : null;
    let K1 = Ks ? Ks[0] : null;
    let DST1 = DSTs ? DSTs[0] : null;

    const styles =  {
        removeCurrentRosterPlayerButton: {
            fontWeight: "bold"
        },
    }

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

        return potentialFlexes.reduce((prev, current) => (prev && prev.price > current.price) ? prev : current, null)
    };

    const getPlayerOverallText = (player) => {
        return `${player.name} (${player.team} - ${player.position})`
    };

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
    const handleRemovePlayerFromRoster = (targetPlayer) => {
        logEvent(analytics, "remove_player_from_roster", {
            player: getPlayerOverallText(targetPlayer)
        });
        setRoster(roster.filter((player) => player !== targetPlayer));
    }
    const handlePlayerInfoClick = (player) => {
        setShowModal(true);
        setPlayerToEdit(player);
    }
    const renderPlayerInfo = (player) => {
        // console.log(player);
        return <>
            <div onClick={() =>handlePlayerInfoClick(player)}>
                {player ? `${getPlayerOverallText(player)}: $${player.price}` : ""}
            </div>
        </>
        
    }
    const renderRemovePlayerButton = (player) => {
        return player ? <button onClick={() => handleRemovePlayerFromRoster(player)} style={styles.removeCurrentRosterPlayerButton}>X</button> : <></>
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newPrice = parseInt(event.target.newPrice.value);
        
        setRoster(roster.map((player) =>
            player.id === playerToEdit.id
            ? {...player, price: newPrice}
            : player
        ))

        let temp = currentAvailablePlayers.map((player) =>
            player.id === playerToEdit.id
            ? {...player, price: newPrice}
            : player
        )
        temp.sort((a,b) => b.price - a.price);
        logEvent(analytics, "edit_player_price",
            {
                name: playerToEdit.name,
                price: newPrice,
                name_price: `${playerToEdit.name}: ${newPrice}`,
            }
        );
        setCurrentAvailablePlayers(temp);
        setShowModal(false);
        setPlayerToEdit(null);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setPlayerToEdit(null);
    }

    return <>
        <div className='justify-evenly'>
            <Modal className='justify-center items-center py-40' show={showModal} onClose={handleCloseModal}>
                <Modal.Header>{playerToEdit && getPlayerOverallText(playerToEdit)}</Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <p className="text-sm font-bold">Current Price: {playerToEdit && playerToEdit.price}</p>
                            <br></br>
                            <div className='flex gap-4 items-center'>
                                <Label className='text-sm font-bold align-middle' htmlFor="new-price">New Price: </Label>
                                <TextInput
                                    className="text-sm font-bold"
                                    sizing="sm"
                                    name='newPrice'
                                    id="new-price"
                                    type='number'
                                    min={1}
                                    max={200}
                                    step={1}
                                    defaultValue={playerToEdit && playerToEdit.price}
                                />
                            </div>
                            <Button className='mt-6' type="submit">Submit</Button>
                        </form>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button type='submit'>Edit Price</Button>
                </Modal.Footer> */}
            </Modal>
            <table id="starting-lineup" className="table-fixed items-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <thead>
                    <tr>
                        <th className='w-1/4'>Pos</th>
                        <th className='w-3/5'>Player</th>
                        <th className='w-1/8'></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>QB</td>
                        <td>
                            {renderPlayerInfo(QB1)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(QB1)}
                        </td>
                    </tr>
                    <tr>
                        <td>RB</td>
                        <td>
                            {renderPlayerInfo(RB1)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(RB1)}
                        </td>
                    </tr>
                    <tr>
                        <td>RB</td>
                        <td>
                            {renderPlayerInfo(RB2)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(RB2)}
                        </td>
                    </tr>
                    <tr>
                        <td>WR</td>
                        <td>
                            {renderPlayerInfo(WR1)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(WR1)}
                        </td>
                    </tr>
                    <tr>
                        <td>WR</td>
                        <td>
                            {renderPlayerInfo(WR2)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(WR2)}
                        </td>
                    </tr>
                    <tr>
                        <td>TE</td>
                        <td>
                            {renderPlayerInfo(TE1)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(TE1)}
                        </td>
                    </tr>
                    <tr>
                        <td>FLEX</td>
                        <td>
                            {renderPlayerInfo(getFlex())}
                        </td>
                        <td>
                            {renderRemovePlayerButton(getFlex())}
                        </td>
                    </tr>
                    <tr>
                        <td>K</td>
                        <td>
                            {renderPlayerInfo(K1)}
                        </td>
                        <td>
                            {renderRemovePlayerButton(K1)}
                        </td>
                    </tr>
                    <tr>
                        <td>DST</td>
                        <td>
                            {renderPlayerInfo(DST1)}
                        </td>
                        <td>{renderRemovePlayerButton(DST1)}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 1 && `${getPlayerOverallText(getBench()[0])}: $${getBench()[0].price}`}</td>
                        <td>{getBench().length >= 1 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[0])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 2 && `${getPlayerOverallText(getBench()[1])}: $${getBench()[1].price}`}</td>
                        <td>{getBench().length >= 2 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[1])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 3 && `${getPlayerOverallText(getBench()[2])}: $${getBench()[2].price}`}</td>
                        <td>{getBench().length >= 3 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[2])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 4 && `${getPlayerOverallText(getBench()[3])}: $${getBench()[3].price}`}</td>
                        <td>{getBench().length >= 4 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[3])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 5 && `${getPlayerOverallText(getBench()[4])}: $${getBench()[4].price}`}</td>
                        <td>{getBench().length >= 5 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[4])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                    <tr>
                        <td>BCH</td>
                        <td>{getBench().length >= 6 && `${getPlayerOverallText(getBench()[5])}: $${getBench()[5].price}`}</td>
                        <td>{getBench().length >= 6 && <button onClick={() => handleRemovePlayerFromRoster(getBench()[5])} style={styles.removeCurrentRosterPlayerButton}>X</button>}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
}