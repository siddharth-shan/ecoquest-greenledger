import {
  Megaphone,
  Calendar,
  Video,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Civic Actions — EcoQuest GreenLedger",
};

const meetings = [
  {
    type: "City Council",
    schedule: "2nd & 4th Thursday of each month",
    time: "7:00 PM",
    location: "Council Chambers, City Hall, 18125 Bloomfield Ave",
    description:
      "The main governing body — 5 elected Council members make decisions about the budget, city policies, and development projects. Budget adoption typically happens in June.",
    budgetRelevance:
      "Budget hearings, capital project approvals, contract awards, and policy decisions affecting all 7 departments.",
    videoUrl: "https://www.cerritos.us/GOVERNMENT/city_council/council_meetings.php",
  },
  {
    type: "Planning Commission",
    schedule: "1st & 3rd Wednesday of each month",
    time: "7:00 PM",
    location: "Council Chambers, City Hall",
    description:
      "Reviews and makes recommendations on land use, zoning changes, and development projects that shape Cerritos's future growth.",
    budgetRelevance:
      "Development decisions affect future tax revenue — new businesses mean more sales tax for city services.",
    videoUrl: "https://www.cerritos.us/GOVERNMENT/commissions/planning_commission.php",
  },
  {
    type: "Parks & Recreation Commission",
    schedule: "1st Monday of each month",
    time: "7:00 PM",
    location: "Council Chambers, City Hall",
    description:
      "Advises on parks, recreation programs, and community facilities. Directly connected to the city's sustainability and quality of life goals.",
    budgetRelevance:
      "Oversees programs in the $15.8M Community & Cultural Services budget and $4.5M Parks & Trees budget.",
    videoUrl: "https://www.cerritos.us/GOVERNMENT/commissions/parks_recreation_commission.php",
  },
];

const actionItems = [
  {
    title: "Watch a Meeting",
    description: "City Council meetings are broadcast live and archived online.",
    icon: Video,
    link: "https://www.cerritos.us/GOVERNMENT/city_council/council_meetings.php",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Public Comment",
    description:
      "Anyone can speak during the Public Comment period. You get 3 minutes to address the Council on any topic.",
    icon: Megaphone,
    color: "bg-green-50 text-eco-green",
  },
  {
    title: "Read the Agenda",
    description:
      "Agendas are posted 72 hours before meetings. Look for budget items and sustainability topics.",
    icon: FileText,
    link: "https://www.cerritos.us/GOVERNMENT/city_council/council_agendas.php",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Contact Council Members",
    description:
      "Email or call your City Council members to share your views on budget priorities and sustainability.",
    icon: Users,
    link: "https://www.cerritos.us/GOVERNMENT/city_council/",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function CivicPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-eco-blue-light flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-eco-blue" />
          </div>
          <h1 className="section-title mb-0">
            Civic <span className="text-gradient">Actions</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Budget decisions happen at public meetings — your voice matters. Here&apos;s how to participate.
        </p>
        <div className="section-underline mt-3" />
      </div>

      {/* Key message */}
      <div className="bg-gradient-to-r from-eco-green/5 to-eco-blue/5 rounded-2xl p-6 border border-eco-green/10 mb-8">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
          Knowledge → Action → Impact
        </h3>
        <p className="text-sm text-gray-600">
          You&apos;ve explored the budget, taken sustainability challenges, and
          learned where your tax dollars go. The next step? <strong>Show up.</strong>{" "}
          City Council meetings are where $131.4 million in spending decisions
          get made — and every resident can participate.
        </p>
      </div>

      {/* Meeting Schedule */}
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">
        Public Meeting Schedule
      </h2>
      <div className="space-y-4 mb-8">
        {meetings.map((meeting) => (
          <div
            key={meeting.type}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-heading font-bold text-lg text-gray-900">
                {meeting.type}
              </h3>
              {meeting.videoUrl && (
                <a
                  href={meeting.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-eco-blue hover:text-eco-blue/80 font-medium"
                >
                  <Video className="w-3.5 h-3.5" /> Watch
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                {meeting.schedule}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {meeting.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{meeting.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>

            <div className="bg-eco-green-light/30 rounded-lg p-3 mt-3">
              <p className="text-xs font-medium text-eco-green-dark">
                💰 Budget Connection:{" "}
                <span className="font-normal text-gray-600">
                  {meeting.budgetRelevance}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* How to Participate */}
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">
        How to Participate
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {actionItems.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-gray-900">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-eco-green hover:text-eco-green-dark font-medium mt-3"
              >
                Learn more <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Youth callout */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50 text-center">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
          Under 18? Your voice still counts!
        </h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          You don&apos;t have to be a voter to speak at a City Council meeting.
          Anyone can participate in Public Comment. Bring what you&apos;ve learned
          from the Budget Explorer and your sustainability challenges — Council
          members listen to residents of all ages.
        </p>
      </div>

      <div className="text-xs text-gray-400 text-center mt-6">
        Meeting schedules from cerritos.us | Budget: FY 2025-26 Adopted Budget
      </div>
    </div>
  );
}
