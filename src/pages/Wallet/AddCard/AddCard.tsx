// import React, { useState } from 'react';
// import Button from '../../../components/UI/atoms/Button/Button';
// import { TextInput } from '../../../components/UI/atoms/Input/Input';
// import styles from '../NewCard/NewCard.module.scss';
// import x from '../../../assets/icons/x.svg';

// export default function AddCard({
//   setShowModal,
//   setShowAddCard,
//   setShow,
// }: {
//   setShowModal: (() => boolean) => void;
//   setShowAddCard: () => void;
//   setShow: (boolean) => void;
// }) {
//   const [page, setPage] = useState(1);
//   const conditionalComponent = () => {
//     const handlePage = () => {
//       setPage(page + 1);
//       console.log('hello world');
//     };

//     const cancel = () => {
//       setShow(false);
//       setShowAddCard(() => false);
//       setShowModal(false);
//     };
//     if (page === 1) {
//       return (
//         <main className={styles.NewCard}>
//           <div className={styles.cancel} onClick={cancel}>
//             <img src={x} />
//           </div>
//           <h1>New card</h1>
//           <div>
//             <TextInput
//               placeholder="0000 0000 0000 0000"
//               inputName="Card number"
//             />
//           </div>
//           <div className={styles.cardDetailsFlex}>
//             <div>
//               <TextInput
//                 placeholder="mm/yy"
//                 inputName="Expiry date"
//                 inputStyle={{ width: '116px' }}
//               />
//             </div>

//             <div className={styles.cvv}>
//               <TextInput
//                 placeholder="000"
//                 inputName="CVV"
//                 inputStyle={{ width: '153px' }}
//               />
//               <p>Check the back of the card for a 3-digit number.</p>
//             </div>
//           </div>
//           <div className={styles.saveCard}>
//             <input type="checkbox" />
//             <p>Save card to your symble account for reuse</p>
//           </div>
//           <Button
//             disabled
//             variant="text"
//             buttonStyles={{ margin: '0 auto', width: '315px' }}
//             clicked={handlePage}
//           >
//             Confirm
//           </Button>
//         </main>
//       );
//     }
//   };
//   return <>{conditionalComponent()}</>;
// }

import React from 'react';

function AddCard() {
  return <div>AddCard</div>;
}

export default AddCard;
