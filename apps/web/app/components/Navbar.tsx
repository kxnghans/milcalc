import Link from 'next/link';
import { Icon } from './Icon';
import { ICONS } from '@repo/ui/icons';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Section: Title */}
          <div className="text-2xl font-bold text-text">
            <Link href="/">MilCalc</Link>
          </div>

          {/* Center Section: Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-surface-hover">
              <Icon name={ICONS.RESET} size={24} />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-hover">
              <Icon name={ICONS.DOCUMENT} size={24} />
            </button>
            <ThemeSwitcher />
          </div>

          {/* Right Section: Page Links with Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/pt" className="flex items-center text-text hover:text-primary">
              <Icon name={ICONS.WEIGHT_LIFTER} size={20} className="mr-2" />
              PT
            </Link>
            <Link href="/pay" className="flex items-center text-text hover:text-primary">
              <Icon name={ICONS.PAY} size={20} className="mr-2" />
              Pay
            </Link>
            <Link href="/retirement" className="flex items-center text-text hover:text-primary">
              <Icon name={ICONS.RETIREMENT} size={20} className="mr-2" />
              Retirement
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}