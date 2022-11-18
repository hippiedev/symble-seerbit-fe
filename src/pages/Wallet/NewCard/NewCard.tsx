// import React,{useState} from 'react'
// // import styles from './NewCard.module.scss';
// import x from '../../../assets/icons/x.svg'

// import { TextInput } from '../../../components/UI/atoms/Input/Input'
// import Button from '../../../components/UI/atoms/Button/Button';
// import SendFunds from '../SendFunds/SendFunds';
// import FundWallet from '../FundWallet/FundWallet';
// import AddCard from '../AddCard/AddCard';

// const NewCard = ({show, setShow, closeModal, setShowModal, setShowFundWallet, showFundWallet, showAddCard, setShowAddCard, setWithdraw, withdraw, sendFunds, setSendFunds}) => {
//   return (
//     <>
//     {
//       showFundWallet? <FundWallet setShowModal={setShowModal} setShowFundWallet={setShowFundWallet} closeModal={closeModal} setShow={setShow}/>:
//       showAddCard ? <AddCard setShowModal={setShowModal} setShowAddCard={setShowAddCard}  setShow={setShow}/>:
//       // withdraw ? <Withdraw  setShowModal={setShowModal} setWithdraw={setWithdraw}/>:
//       sendFunds && <SendFunds setShowModal={setShowModal} setSendFunds={setSendFunds} show={show} setShow={setShow}/>

//     }
//     </>
//   )
// }

// export default NewCard

// // export const FundWallet = ({setShowModal, setShowFundWallet}) =>{
// //   const [fundPage, setFundPage] = useState(0)
// //   const cancel = () =>{
// //     setShowModal(false)
// //     setShowFundWallet(false)
// //   }
// //   return(
// //     <>
// //     <main className={styles.NewCard} >
// //         <div className={styles.cancel} onClick={cancel}>
// //             <img src={x} />
// //         </div>
// //       <h1>Fund wallet</h1>
// //       <div>
// //         <p>Enter the amount you wish to pay into your wallet:</p>
// //         <div>
// //           <p>1 symble coin = 50 Naira</p>
// //         </div>
// //         <TextInput
// //         placeholder="0000 0000 0000 0000"

// //         />
// //          <TextInput
// //         placeholder="0000 0000 0000 0000"

// //         />
// //       </div>
// //         <Button
// //         disabled
// //         variant='text'
// //         buttonStyles={{margin:"0 auto", width:"315px"}}
// //         clicked={()=>setFundPage(fundPage + 1)}
// //         >Proceed</Button>
// //     </main>
// //     </>
// //   )
// // }

// // export const SendFunds = ({setShowModal, setSendFunds}) =>{
// //   const cancel = () =>{
// //     setShowModal(false)
// //     setSendFunds(false)

// //   }
// //   return(
// //     <>
// //     <main className={styles.NewCard} >
// //         <div className={styles.cancel} onClick={cancel}>
// //             <img src={x} />
// //         </div>
// //       <h1>Send Funds</h1>
// //       <div>
// //         <TextInput
// //         placeholder="0000 0000 0000 0000"
// //         inputName="Card number"
// //         />
// //       </div>
// //         <div className={styles.cardDetailsFlex}>
// //             <div>
// //                 <TextInput
// //                 placeholder="mm/yy"
// //                 inputName="Expiry date"
// //                 inputStyle={{width:"116px"}}
// //                 />
// //             </div>

// //             <div className={styles.cvv}>
// //                 <TextInput
// //                 placeholder="000"
// //                 inputName="CVV"
// //                 inputStyle={{width:"153px"}}
// //                 />
// //                 <p>Check the back of the card for a 3-digit number.</p>
// //             </div>
// //         </div>
// //         <div className={styles.saveCard}>
// //             <input type="checkbox"/>
// //             <p>Save card to your symble account for reuse</p>
// //         </div>
// //         <Button
// //         disabled
// //         variant='text'
// //         buttonStyles={{margin:"0 auto", width:"315px"}}
// //         >Confirm</Button>
// //     </main>
// //     </>
// //   )
// // }

// // export const AddCard = ({setShowModal, setShowAddCard}) =>{
// //   const cancel = () =>{
// //     setShowModal(false)
// //     setShowAddCard(false)

// //   }
// //   return(
// //     <>
// //       <main className={styles.NewCard} >
// //         <div className={styles.cancel} onClick={cancel}>
// //             <img src={x} />
// //         </div>
// //       <h1>New card</h1>
// //       <div>
// //         <TextInput
// //         placeholder="0000 0000 0000 0000"
// //         inputName="Card number"
// //         />
// //       </div>
// //         <div className={styles.cardDetailsFlex}>
// //             <div>
// //                 <TextInput
// //                 placeholder="mm/yy"
// //                 inputName="Expiry date"
// //                 inputStyle={{width:"116px"}}
// //                 />
// //             </div>

// //             <div className={styles.cvv}>
// //                 <TextInput
// //                 placeholder="000"
// //                 inputName="CVV"
// //                 inputStyle={{width:"153px"}}
// //                 />
// //                 <p>Check the back of the card for a 3-digit number.</p>
// //             </div>
// //         </div>
// //         <div className={styles.saveCard}>
// //             <input type="checkbox"/>
// //             <p>Save card to your symble account for reuse</p>
// //         </div>
// //         <Button
// //         disabled
// //         variant='text'
// //         buttonStyles={{margin:"0 auto", width:"315px"}}
// //         >Confirm</Button>
// //     </main>
// //     </>
// //   )
// // }

// // export const Withdraw =({setWithdraw,setShowModal}) =>{
// //   const cancel = () =>{
// //     setShowModal(false)
// //     setWithdraw(false)

// //   }
// //   return(
// //     <>
// //       <main className={styles.NewCard} >
// //         <div className={styles.cancel} onClick={cancel}>
// //             <img src={x} />
// //         </div>
// //       <h1>withdraw</h1>
// //       <div>
// //         <TextInput
// //         placeholder="0000 0000 0000 0000"
// //         inputName="Card number"
// //         />
// //       </div>
// //         <div className={styles.cardDetailsFlex}>
// //             <div>
// //                 <TextInput
// //                 placeholder="mm/yy"
// //                 inputName="Expiry date"
// //                 inputStyle={{width:"116px"}}
// //                 />
// //             </div>

// //             <div className={styles.cvv}>
// //                 <TextInput
// //                 placeholder="000"
// //                 inputName="CVV"
// //                 inputStyle={{width:"153px"}}
// //                 />
// //                 <p>Check the back of the card for a 3-digit number.</p>
// //             </div>
// //         </div>
// //         <div className={styles.saveCard}>
// //             <input type="checkbox"/>
// //             <p>Save card to your symble account for reuse</p>
// //         </div>
// //         <Button
// //         disabled
// //         variant='text'
// //         buttonStyles={{margin:"0 auto", width:"315px"}}
// //         >Confirm</Button>
// //     </main>
// //     </>
// //   )
// // }

import React from 'react';

function NewCard() {
  return <div>NewCard</div>;
}

export default NewCard;
