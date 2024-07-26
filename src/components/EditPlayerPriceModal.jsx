export default function EditPlayerPriceModal(props) {
    const showModal = props.showModal;
    console.log(showModal);
    return <>
        {showModal && <div>
            Edit Player Price Modal
        </div>}
    </>
}