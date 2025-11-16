import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ruler, User } from 'lucide-react';

interface SizingGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SizingGuideModal({ open, onOpenChange }: SizingGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Ruler className="h-6 w-6" />
            Belt Sizing Guide
          </DialogTitle>
          <DialogDescription>
            Follow these guidelines to find your perfect belt size
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* How to Measure */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                1
              </span>
              How to Measure Your Waist
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Measure around your waist where you typically wear your belt (usually at the top of your hips)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Keep the tape measure snug but not tight</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Note the measurement in inches</span>
              </p>
            </div>
          </div>

          {/* Size Chart */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Belt Size Chart
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Waist Size</th>
                    <th className="border border-border p-3 text-left">Belt Size</th>
                    <th className="border border-border p-3 text-left">Total Belt Length</th>
                    <th className="border border-border p-3 text-left">Fit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { waist: '26"-28"', size: '30"', length: '35"', fit: 'Snug' },
                    { waist: '28"-30"', size: '32"', length: '37"', fit: 'Perfect' },
                    { waist: '30"-32"', size: '34"', length: '39"', fit: 'Perfect' },
                    { waist: '32"-34"', size: '36"', length: '41"', fit: 'Perfect' },
                    { waist: '34"-36"', size: '38"', length: '43"', fit: 'Perfect' },
                    { waist: '36"-38"', size: '40"', length: '45"', fit: 'Perfect' },
                    { waist: '38"-40"', size: '42"', length: '47"', fit: 'Perfect' },
                    { waist: '40"-42"', size: '44"', length: '49"', fit: 'Perfect' },
                    { waist: '42"-44"', size: '46"', length: '51"', fit: 'Perfect' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/50">
                      <td className="border border-border p-3">{row.waist}</td>
                      <td className="border border-border p-3 font-semibold">{row.size}</td>
                      <td className="border border-border p-3 text-muted-foreground">{row.length}</td>
                      <td className="border border-border p-3">
                        <Badge variant={row.fit === 'Perfect' ? 'default' : 'secondary'}>
                          {row.fit}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sizing Tips */}
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Pro Sizing Tips
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Choose one size up:</strong> Your belt size should be 2-4 inches larger than your pant size for optimal comfort</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Consider buckle placement:</strong> The ideal hole is the middle one for adjustability</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Account for layers:</strong> If you wear thick clothing, consider sizing up</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Leather stretches:</strong> New leather belts may feel snug at first but will loosen with wear</span>
              </p>
            </div>
          </div>

          {/* Visual Guide */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Belt Holes Guide</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((hole) => (
                  <div
                    key={hole}
                    className={`w-3 h-3 rounded-full border-2 border-foreground ${
                      hole === 3 ? 'bg-primary' : 'bg-background'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              The middle hole (highlighted) should be your most-used hole for best fit
            </p>
          </div>

          <Button onClick={() => onOpenChange(false)} className="w-full" size="lg">
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
