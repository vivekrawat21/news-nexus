"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

export default function PayoutPage() {
  // States for payout calculation
  const [rate, setRate] = useState<number>(0);
  const [articles, setArticles] = useState<number>(0);
  const [totalPayout, setTotalPayout] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]); // Store previous payouts
  const [isClient, setIsClient] = useState(false); // Check if it's the client-side render
  const router = useRouter();
 
  // Ensure we're on the client-side before trying to access the user or localStorage
  useEffect(() => {
    setIsClient(true); // Update state once the component has been mounted on the client-side
  }, []);

  // Load payout history from local storage
  useEffect(() => {
    if (isClient) {
      const savedPayouts = localStorage.getItem("payoutHistory");
      if (savedPayouts) {
        setPayoutHistory(JSON.parse(savedPayouts));
      }

      // Load previously saved rate and articles from localStorage on page load
      const savedRate = localStorage.getItem("payoutRate");
      const savedArticles = localStorage.getItem("numberOfArticles");
      if (savedRate && savedArticles) {
        setRate(Number(savedRate));
        setArticles(Number(savedArticles));
        calculatePayout(Number(savedRate), Number(savedArticles));
      }
    }
  }, [isClient]); // Run only after the component is mounted on the client

  useEffect(() => {
    if (isClient) {
      // Save payout rate and articles to localStorage whenever they change
      localStorage.setItem("payoutRate", String(rate));
      localStorage.setItem("numberOfArticles", String(articles));
    }
  }, [rate, articles, isClient]);

  // Function to calculate the total payout
  const calculatePayout = (rate: number, articles: number) => {
    setTotalPayout(rate * articles);
  };

  // Save current payout to history and localStorage
  const savePayoutHistory = () => {
    const newPayout = {
      id: `INV${Math.floor(Math.random() * 10000)}`,
      rate,
      articles,
      totalPayout: totalPayout.toFixed(2),
      date: new Date().toLocaleDateString(),
    };
    // Update the payout history
    const updatedHistory = [newPayout, ...payoutHistory];
    setPayoutHistory(updatedHistory);
    // Save updated history to local storage
    if (isClient) {
      localStorage.setItem("payoutHistory", JSON.stringify(updatedHistory));
    }
    // Optionally, reset inputs after saving
    setRate(0);
    setArticles(0);
    setTotalPayout(0);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payout History", 20, 20);

    let yOffset = 30;
    payoutHistory.forEach((payout) => {
      doc.text(`Invoice: ${payout.id}`, 20, yOffset);
      doc.text(`Date: ${payout.date}`, 20, yOffset + 10);
      doc.text(`Rate: $${payout.rate}`, 20, yOffset + 20);
      doc.text(`Articles: ${payout.articles}`, 20, yOffset + 30);
      doc.text(`Total Payout: $${payout.totalPayout}`, 20, yOffset + 40);
      yOffset += 50;
    });
    doc.save("payout_history.pdf");
  };

  if (!isClient) {
    return null; // Return null until client-side hydration is done
  }

  return (
    <div className="flex flex-col space-y-8 p-8 bg-transparent text-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-extrabold text-white">
          Payout Calculator
        </h2>
        <Button
          onClick={() => router.back()}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Go Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Payout Input Section */}
        <div className="col-span-2 lg:col-span-2 p-6 bg-transparent border border-gray-600 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-white mb-6">
            Calculate Payout
          </h3>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rate">Payout Rate per Article</Label>
              <Input
                id="rate"
                placeholder="Enter rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="text-lg p-3 border border-gray-600 rounded-md bg-transparent text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="articles">Number of Articles/Blogs</Label>
              <Input
                id="articles"
                placeholder="Enter number of articles"
                type="number"
                value={articles}
                onChange={(e) => setArticles(Number(e.target.value))}
                className="text-lg p-3 border border-gray-600 rounded-md bg-transparent text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label>Total Payout</Label>
              <div className="text-2xl font-bold">
                ${totalPayout.toFixed(2)}
              </div>
            </div>
          </div>

          <Button
            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
            onClick={() => calculatePayout(rate, articles)}
          >
            Calculate Payout
          </Button>

          <Button
            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
            onClick={savePayoutHistory}
          >
            Save Payout
          </Button>
        </div>

        {/* Export and Previous Payouts Section */}
        <div className="col-span-1 lg:col-span-1 p-6 bg-transparent border border-gray-600 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-white mb-6">
            Export and Previous Payouts
          </h3>

          <div className="flex flex-col space-y-4">
            {/* Export to CSV */}
            <CSVLink
              data={payoutHistory.map((payout) => ({
                ...payout,
                totalPayout: `$${payout.totalPayout}`, // Format payout for CSV
              }))}
              headers={[
                { label: "Invoice", key: "id" },
                { label: "Date", key: "date" },
                { label: "Rate", key: "rate" },
                { label: "Articles", key: "articles" },
                { label: "Total Payout", key: "totalPayout" },
              ]}
              filename="payout_history.csv"
            >
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">
                Export to CSV
              </Button>
            </CSVLink>

            {/* Export to PDF */}
            <Button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
              onClick={exportToPDF}
            >
              Export to PDF
            </Button>

            {/* Display Previous Payouts */}
            <div className="mt-6 bg-gray-800 p-4 rounded-md shadow-sm">
              <h4 className="text-lg font-semibold text-white mb-4">
                Previous Payouts
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-white">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-2">Invoice</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Rate</th>
                      <th className="px-4 py-2">Articles</th>
                      <th className="px-4 py-2">Total Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutHistory.map((payout) => (
                      <tr key={payout.id} className="border-b border-gray-700">
                        <td className="px-4 py-2">{payout.id}</td>
                        <td className="px-4 py-2">{payout.date}</td>
                        <td className="px-4 py-2">${payout.rate}</td>
                        <td className="px-4 py-2">{payout.articles}</td>
                        <td className="px-4 py-2">${payout.totalPayout}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
