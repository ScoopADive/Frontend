function TimelineBox() {
  const milestones = [
    { date: '2024-05', title: 'Open Water Certified' },
    { date: '2024-08', title: 'Advanced Open Water Certified' },
    { date: '2025-01', title: 'Rescue Diver Certified' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">🌟 Certification Timeline</h3>
      <div className="space-y-2 border-l-2 border-blue-300 pl-4">
        {milestones.map((m, idx) => (
          <div key={idx}>
            <p className="text-sm text-gray-600">{m.date}</p>
            <p className="font-medium">{m.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineBox;
