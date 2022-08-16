/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from './api/posts';
import { Journal, Contact, Manifesto, Home } from './pages';
import { Footer, Auth, Header, Login, JournalDetails, AddJournal } from './components';
import Navbar from './components/marginals/Navbar/Navbar';
import Edit from './components/EditJournal/Edit';
import useAxiosFetch from './hooks/useAxiosFetch';
import { DataProvider } from './context/DataContext';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [title, setTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [editAuthors, setEditAuthors] = useState('');
  const [journaltype, setJournaltype] = useState('');
  const [editJournaltype, setEditJournaltype] = useState('');
  const [topic, setTopic] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [published, setPublished] = useState('');
  const [issn, setIssn] = useState();
  const [editIssn, setEditIssn] = useState();
  const [updated, setUpdated] = useState(format(new Date(), 'MMMM dd, yyyyy pp'));
  const [link, setLink] = useState('');
  const [editLink, setEditLink] = useState('');
  const [policy, setPolicy] = useState('policy 1');
  const [editPolicy, setEditPolicy] = useState('policy 1');
  const [dataavail, setDataavail] = useState(false);
  const [editDataavail, setEditDataavail] = useState(false);
  const handleChangeData = (nextChecked) => {
    setDataavail(nextChecked);
  };
  const [datashared, setDatashared] = useState(false);
  const [editDatashared, setEditDatashared] = useState(false);
  const handleChangeData2 = (nextChecked) => {
    setDatashared(nextChecked);
  };
  const [peerreview, setPeerreview] = useState(false);
  const [editPeerreview, setEditPeerreview] = useState(false);
  const handleChangePeer = (nextChecked) => {
    setPeerreview(nextChecked);
  };
  const [enforced, setEnforced] = useState('');
  const [editEnforced, setEditEnforced] = useState('');
  const [evidence, setEvidence] = useState('');
  const [editEvidence, setEditEvidence] = useState('');
  const [isPending, setIsPending] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = posts.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const history = useHistory();

  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/journals');

  useEffect(() => {
    setPosts(data);
  }, [data]);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.issn.includes(search) || post.title.toLowerCase().includes(search.toLowerCase()),
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = searchResults.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyyy pp');
    const newPost = {
      title,
      authors,
      journaltype,
      topic,
      published: datetime,
      issn,
      updated,
      link,
      policy,
      dataavail,
      datashared,
      peerreview,
      enforced,
      evidence,
    };
    try {
      const response = await api.post('/journals', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      history.push('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyyy pp');
    const updatedPost = {
      title: editTitle,
      authors: editAuthors,
      journaltype: editJournaltype,
      topic: editTopic,
      issn: editIssn,
      updated: datetime,
      link: editLink,
      policy: editPolicy,
      dataavail: editDataavail,
      datashared: editDatashared,
      peerreview: editPeerreview,
      enforced: editEnforced,
      evidence: editEvidence,
    };
    try {
      const response = await api.put(`/journals/${id}`, updatedPost);
      setPosts(posts.map((post) => (post.id === id ? { ...response.data } : post)));
      history.push('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journals/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      history.push('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <div className='App'>
      <DataProvider>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/manifesto'>
            <Manifesto />
          </Route>
          <Route path='/journal'>
            <Journal />
          </Route>
          <Route exact path='/addjournal'>
            <AddJournal />
          </Route>
          <Route path='/edit/:id'>
            <Edit />
          </Route>
          <Route path='/policy/:id'>
            <JournalDetails />
          </Route>
          <Route path='/Signup'>
            <Auth />
          </Route>
          <Route path='/Login'>
            <Login />
          </Route>
          <Redirect to='/' />
        </Switch>
        <Navbar />
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
