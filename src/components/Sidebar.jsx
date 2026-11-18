import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import avatarPhoto from '../assets/images/gift_chinedu_avatar_1795014259298.jpg';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', iconClass: 'fa-solid fa-grip', end: true },
  {
    to: '/transactions',
    label: 'Transactions',
    iconClass: 'fa-solid fa-receipt',
    end: false,
  },
];

function ProfileAvatar({ sizeClass }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`avatar-fallback ${sizeClass}`} aria-hidden="true">
        GC
      </div>
    );
  }

  return (
    <>
      {/* replace with Gift's photo */}
      <img
        src={avatarPhoto}
        alt="Gift Chinedu"
        className={`avatar-img ${sizeClass}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    </>
  );
}

export function MobileIdentityBar() {
  return (
    <header className="mobile-identity-bar">
      <div className="mobile-identity-inner">
        <ProfileAvatar sizeClass="avatar-sm" />
        <span className="profile-name">Gift Chinedu</span>
      </div>
    </header>
  );
}

export default function Sidebar() {
  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-top">
          <div className="profile-block">
            <ProfileAvatar sizeClass="avatar-lg" />
            <p className="profile-name">Gift Chinedu</p>
          </div>

          <nav className="sidebar-nav" aria-label="Primary pages">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' is-active' : ''}`
                }
              >
                <i className={`${item.iconClass} sidebar-icon`} aria-hidden="true" />
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <NavLink
            to="/export"
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' is-active' : ''}`
            }
          >
            <i className="fa-solid fa-download sidebar-icon" aria-hidden="true" />
            <span className="sidebar-label">Export</span>
          </NavLink>
        </div>
      </aside>

      <nav className="mobile-tab-bar" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `mobile-tab-link${isActive ? ' is-active' : ''}`
            }
          >
            <i className={item.iconClass} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/export"
          className={({ isActive }) =>
            `mobile-tab-link${isActive ? ' is-active' : ''}`
          }
        >
          <i className="fa-solid fa-download" aria-hidden="true" />
          <span>Export</span>
        </NavLink>
      </nav>
    </>
  );
}
