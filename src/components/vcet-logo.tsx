import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export function VcetLogo() {
  const { vcetShield } = placeholderImages;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image 
            src={vcetShield.src}
            width={vcetShield.width} 
            height={vcetShield.height}
            alt={vcetShield.alt}
            data-ai-hint={vcetShield.hint}
            className="h-14 w-auto"
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-wider text-foreground">VCET</h2>
          <p className="text-xs text-muted-foreground -mt-1">Empowering the Next Generation</p>
        </div>
        <div className="h-12 w-px bg-border" />
        <div className="max-w-[150px]">
          <p className="text-sm font-semibold leading-tight">
            Velalar College of Engineering and Technology
          </p>
        </div>
      </div>
    </div>
  );
}
