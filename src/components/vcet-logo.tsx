import Image from 'next/image';

export function VcetLogo() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image 
            src="https://picsum.photos/seed/vcet-shield/48/60" 
            width={48} 
            height={60} 
            alt="VCET Shield"
            data-ai-hint="shield logo" 
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
