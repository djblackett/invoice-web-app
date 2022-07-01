import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data.json';
import Header from './components/Header';
import styled from 'styled-components';
import TitleGrid from './components/TitleGrid';
import InvoiceCard from './components/InvoiceCard';
import InvoiceGrid from './components/InvoiceGrid';
import { GlobalStyles } from './components/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/Themes';
import EmptyList from './components/EmptyList';
import Modal from './components/Modal';
import EditForm from './components/EditForm';
import { useWindowWidth } from './hooks/useWindowWidth';
 import { doc, getDoc } from "firebase/firestore";
 import { firestoreDb } from './utils/firebase';
 import { collection, getDocs } from "firebase/firestore"; 


const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 103px 1fr;
  }
`;

function App() {
  const [filter, setFilter] = useState('All');
  // eslint-disable-next-line no-unused-vars
  const [unfilteredList, setUnfilteredList] = useState(data);
  const [invoiceList, setInvoiceList] = useState(data);

  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(true);
  const [padding, setPadding] = useState(0);

  const width = useWindowWidth();

  function toggleEditTab() {
    if (isEditOpen) {
      setIsEditOpen(false);
    } else {
      setIsEditOpen(true);
    }
  }

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  // const themeTogglerEnter = (e) => {
  //   if (e.charCode === 13 || e.keyCode === 13) {
  //     theme === 'light' ? setTheme('dark') : setTheme('light');
  //   }
  // };

  const handleChangeFilter = (status) => {
    setFilter(status);
  };

  useEffect(() => {
    setInvoiceList(
      unfilteredList.filter((invoice) => {
        if (filter === 'All') {
          return true;
        } else if (filter === 'Paid') {
          return invoice.status === 'paid';
        } else if (filter === 'Pending') {
          return invoice.status === 'pending';
        } else if (filter === 'Draft') {
          return invoice.status === 'draft';
        }
      })
    );
  }, [filter, unfilteredList]);

 

  async function testDBFunction() {
const docRef = doc(firestoreDb, "cities", "SF");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}

const querySnapshot = await getDocs(collection(firestoreDb, "invoices"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
  }

  const handleClose = () => {
    setIsOpen(false);
    setPadding(0);
    }

  useEffect(() => {
    testDBFunction();
  }, [])

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />

      <Main id="container">
        <Header themeToggler={themeToggler} />
        <button
          style={{ padding: '5px', position: 'absolute', right: '10px', top: '10px' }}
          onClick={() => toggleEditTab()}>
          Edit
        </button>
        <p
          style={{
            padding: '5px',
            position: 'absolute',
            right: '10px',
            top: '30px',
            border: '1px solid black'
          }}>
          width: ${width}px
        </p>
        <EditForm isEditOpen={isEditOpen} handleClose={handleClose} padding={padding} setPadding={setPadding}  />
        <TitleGrid handleChangeFilter={handleChangeFilter} invoiceList={invoiceList} />
        {invoiceList.length > 0 && (
          <InvoiceGrid>
            {invoiceList.map((invoice) => {
              return <InvoiceCard invoice={invoice} key={invoice.id} />;
            })}
          </InvoiceGrid>
        )}

        {invoiceList.length === 0 && <EmptyList />}
        <button onClick={() => setIsOpen(true)}>Click to Open Modal</button>

        <Modal handleClose={() => setIsEditOpen(false)} isOpen={isOpen}>
          This is Modal Content!
        </Modal>
      </Main>
    </ThemeProvider>
  );
}

export default App;
