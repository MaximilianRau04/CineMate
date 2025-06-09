import { formatDateForInput } from "../utils/utils";

const PersonForm = ({ person, onChange }) => (
  <div>
    <div className="mb-3">
      <label className="form-label">Name</label>
      <input
        type="text"
        className="form-control"
        value={person.name || ''}
        onChange={(e) => onChange({ ...person, name: e.target.value })}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Geburtsdatum</label>
      <input
        type="date"
        className="form-control"
        value={formatDateForInput(person.birthday) || ''}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value).getTime() : null;
          onChange({ ...person, birthday: date });
        }}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Bild URL</label>
      <input
        type="text"
        className="form-control"
        value={person.image || ''}
        onChange={(e) => onChange({ ...person, image: e.target.value })}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Biografie</label>
      <textarea
        className="form-control"
        rows="4"
        value={person.biography || ''}
        onChange={(e) => onChange({ ...person, biography: e.target.value })}
      />
    </div>
  </div>
);

export default PersonForm;