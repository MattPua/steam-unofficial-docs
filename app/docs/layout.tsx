import { source } from '@/lib/source';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const docsOptions: DocsLayoutProps = {
  ...baseOptions(),
  tree: source.pageTree,
  sidebar: {
    banner: 
    <div>
      <Link aria-label='GitHub' target='_blank' className="rounded-full border inline-flex p-2 hover:bg-gray-100 items-center gap-2 transition ease-in-out duration-200 group" href="https://github.com/mattpua/steam-unofficial-docs"><Github className="group-hover:text-blue-500" size={20} /> </Link>
    </div>
  },
};
  return (
    <DocsLayout {...docsOptions} >
      {children}
    </DocsLayout>
  );
}
