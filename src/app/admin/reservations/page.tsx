"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

type Reservation = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  notes: string | null;
  status: string;
  created_at: string;
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchReservations();
  }, [filterStatus]);

  const fetchReservations = async () => {
    try {
      const url =
        filterStatus === "all"
          ? "/api/reservations"
          : `/api/reservations?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      setReservations(data);
    } catch (e) {
      console.error("Failed to fetch reservations:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update reservation");
        return;
      }

      fetchReservations();
    } catch (e) {
      alert("Failed to update reservation");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete reservation");
        return;
      }

      fetchReservations();
    } catch (e) {
      alert("Failed to delete reservation");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-veloria-black">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <p className="text-veloria-cream text-center">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-veloria-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 pb-16 pt-10">
        <section className="mt-10">
          <div className="veloria-container px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-veloria-cream mb-2">
                Reservations
              </h1>
              <p className="text-sm text-veloria-muted">
                Manage all table reservations
              </p>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-xs text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {reservations.length === 0 ? (
            <div className="rounded-xl border border-veloria-border bg-veloria-elevated/70 p-8 text-center">
              <p className="text-sm text-veloria-muted">No reservations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-xl border border-veloria-border bg-veloria-elevated/70 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-veloria-cream">
                          {reservation.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            reservation.status === "confirmed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : reservation.status === "cancelled"
                              ? "bg-red-500/20 text-red-300"
                              : reservation.status === "completed"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-veloria-muted">
                        <div>
                          <span className="text-veloria-muted/70">Email:</span>{" "}
                          {reservation.email}
                        </div>
                        {reservation.phone && (
                          <div>
                            <span className="text-veloria-muted/70">Phone:</span>{" "}
                            {reservation.phone}
                          </div>
                        )}
                        <div>
                          <span className="text-veloria-muted/70">Date:</span>{" "}
                          {new Date(reservation.reservation_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-veloria-muted/70">Time:</span>{" "}
                          {reservation.reservation_time}
                        </div>
                        <div>
                          <span className="text-veloria-muted/70">Guests:</span>{" "}
                          {reservation.guests}
                        </div>
                        {reservation.notes && (
                          <div className="md:col-span-2">
                            <span className="text-veloria-muted/70">Notes:</span>{" "}
                            {reservation.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={reservation.status}
                        onChange={(e) =>
                          handleStatusChange(reservation.id, e.target.value)
                        }
                        className="rounded-lg border border-veloria-border bg-veloria-black/70 px-2 py-1 text-xs text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </section>
      </main>
    </div>
  );
}
