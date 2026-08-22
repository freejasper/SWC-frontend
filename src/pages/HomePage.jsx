import { useWindowWidth } from '../utilities/useWindowWidth';

import PrimaryLogo from '../assets/PrimaryLogo';
import IconLogo from '../assets/IconLogo';

export default function HomePage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  return (
    <div className="flex flex-col items-center justify-center text-left h-full gap-8">
      <h1 className="text-5xl font-bold invisible h-0">
        Silky Wine Co.
      </h1>
      <div 
        className="w-full flex items-center justify-center">
        {isMobile ? <IconLogo width={windowWidth * 0.8}/> : <PrimaryLogo width={windowWidth} />}
      </div>
      <div 
        className={`
          ${isMobile ? 'w-4/5' : 'w-1/3'}
          flex 
          flex-col 
          justify-between 
          uppercase font-semibold text-xl/5 text-justify [text-align-last:justify] tracking-loose`}>
            <p>Connecting boutique wine producers to wine lovers through local restaurants, bars and independent retailers.</p>
      </div>
    </div>
  )
}