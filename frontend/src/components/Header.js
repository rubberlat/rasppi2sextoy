import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      <h1>デバイス制御アプリ</h1>
      <nav>
        <ul>
          <li><Link to="/">ホーム</Link></li>
          <li><Link to="/diagnostics">診断</Link></li>
          <li><Link to="/control">制御</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;