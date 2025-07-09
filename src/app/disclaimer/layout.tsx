import { I18nProvider } from '@/components/I18nProvider';

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}