import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
  FOOD_MEAL_TYPES,
  FOOD_CATEGORIES,
  PG_EXPENSE_TYPES,
  TRANSPORT_TYPES,
  HOUSEHOLD_TYPES,
  HEALTH_TYPES,
  DONATION_TYPES,
  ELECTRONICS_TYPES,
  ENTERTAINMENT_TYPES,
  CLOTHING_MEN,
  CLOTHING_WOMEN,
  SHOPPING_OTHER_TYPES,
} from '../lib/constants';
import { ArrowLeft, Save, X } from 'lucide-react';

export function AddExpense() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    category: 'food',
    amount: '',
    payment_mode: 'cash',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    metadata: {} as Record<string, any>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess('');

    const expenseData = {
      user_id: user.id,
      category: formData.category,
      amount: parseFloat(formData.amount),
      payment_mode: formData.payment_mode,
      expense_date: formData.expense_date,
      description: formData.description || null,
      metadata: formData.metadata,
    };

    const { error } = await supabase.from('expenses').insert(expenseData);

    if (error) {
      console.error('Error adding expense:', error);
    } else {
      setSuccess('Expense added successfully!');
      setTimeout(() => {
        setFormData({
          category: 'food',
          amount: '',
          payment_mode: 'cash',
          expense_date: new Date().toISOString().split('T')[0],
          description: '',
          metadata: {},
        });
        setSuccess('');
      }, 1500);
    }

    setLoading(false);
  };

  const updateMetadata = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value },
    }));
  };

  const renderCategoryFields = () => {
    switch (formData.category) {
      case 'stationary':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.metadata.item_name || ''}
                onChange={(e) => updateMetadata('item_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Notebook, Pen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject Tag
              </label>
              <input
                type="text"
                value={formData.metadata.subject || ''}
                onChange={(e) => updateMetadata('subject', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="exam_fee"
                checked={formData.metadata.is_exam_fee || false}
                onChange={(e) => updateMetadata('is_exam_fee', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="exam_fee" className="text-sm text-gray-700 dark:text-gray-300">
                This is an exam fee
              </label>
            </div>
          </>
        );

      case 'food':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meal Type
              </label>
              <select
                value={formData.metadata.meal_type || ''}
                onChange={(e) => updateMetadata('meal_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select meal type</option>
                {FOOD_MEAL_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Category
              </label>
              <select
                value={formData.metadata.food_category || ''}
                onChange={(e) => updateMetadata('food_category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select category</option>
                {FOOD_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="food_type"
                    value="mess"
                    checked={formData.metadata.food_type === 'mess'}
                    onChange={(e) => updateMetadata('food_type', e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mess</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="food_type"
                    value="outside"
                    checked={formData.metadata.food_type === 'outside'}
                    onChange={(e) => updateMetadata('food_type', e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Outside</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="food_type"
                    value="grocery"
                    checked={formData.metadata.food_type === 'grocery'}
                    onChange={(e) => updateMetadata('food_type', e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Grocery</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Description
              </label>
              <input
                type="text"
                value={formData.metadata.item_name || ''}
                onChange={(e) => updateMetadata('item_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Dosa, Fruits"
              />
            </div>
          </>
        );

      case 'pg':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expense Type
            </label>
            <select
              value={formData.metadata.expense_type || ''}
              onChange={(e) => updateMetadata('expense_type', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select type</option>
              {PG_EXPENSE_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        );

      case 'transport':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transport Type
              </label>
              <select
                value={formData.metadata.transport_type || ''}
                onChange={(e) => updateMetadata('transport_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {TRANSPORT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={formData.metadata.from_location || ''}
                  onChange={(e) => updateMetadata('from_location', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Starting point"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={formData.metadata.to_location || ''}
                  onChange={(e) => updateMetadata('to_location', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Destination"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hometown_trip"
                checked={formData.metadata.is_hometown_trip || false}
                onChange={(e) => updateMetadata('is_hometown_trip', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="hometown_trip" className="text-sm text-gray-700 dark:text-gray-300">
                Hometown trip
              </label>
            </div>
          </>
        );

      case 'household':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Type
              </label>
              <select
                value={formData.metadata.item_type || ''}
                onChange={(e) => updateMetadata('item_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {HOUSEHOLD_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.metadata.item_name || ''}
                onChange={(e) => updateMetadata('item_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Dish soap, Mop"
              />
            </div>
          </>
        );

      case 'friends':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason
              </label>
              <input
                type="text"
                value={formData.metadata.reason || ''}
                onChange={(e) => updateMetadata('reason', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Birthday treat, Outing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Names of People
              </label>
              <input
                type="text"
                value={formData.metadata.people_names || ''}
                onChange={(e) => updateMetadata('people_names', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Rahim, Suresh"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lent_to_friend"
                checked={formData.metadata.is_lent || false}
                onChange={(e) => updateMetadata('is_lent', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="lent_to_friend" className="text-sm text-gray-700 dark:text-gray-300">
                Expecting return (lent money)
              </label>
            </div>
          </>
        );

      case 'family':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason
              </label>
              <input
                type="text"
                value={formData.metadata.reason || ''}
                onChange={(e) => updateMetadata('reason', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Sent home, Gift"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sent_home"
                checked={formData.metadata.sent_home || false}
                onChange={(e) => updateMetadata('sent_home', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="sent_home" className="text-sm text-gray-700 dark:text-gray-300">
                Sent home
              </label>
            </div>
          </>
        );

      case 'donated':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Donation Type
              </label>
              <select
                value={formData.metadata.donation_type || ''}
                onChange={(e) => updateMetadata('donation_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {DONATION_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.metadata.item_description || ''}
                onChange={(e) => updateMetadata('item_description', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Old clothes, Rice bag"
              />
            </div>
          </>
        );

      case 'health':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.metadata.health_type || ''}
                onChange={(e) => updateMetadata('health_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {HEALTH_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hospital/Pharmacy Name
              </label>
              <input
                type="text"
                value={formData.metadata.hospital_pharmacy_name || ''}
                onChange={(e) => updateMetadata('hospital_pharmacy_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Apollo Hospital"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Doctor Name (Optional)
              </label>
              <input
                type="text"
                value={formData.metadata.doctor_name || ''}
                onChange={(e) => updateMetadata('doctor_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Dr. Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medicine Details
              </label>
              <textarea
                value={formData.metadata.medicine_details || ''}
                onChange={(e) => updateMetadata('medicine_details', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                placeholder="e.g., Paracetamol 500mg, 3 days"
              />
            </div>
          </>
        );

      case 'electronics':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Type
              </label>
              <select
                value={formData.metadata.electronics_type || ''}
                onChange={(e) => updateMetadata('electronics_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {ELECTRONICS_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand/Model
              </label>
              <input
                type="text"
                value={formData.metadata.brand_model || ''}
                onChange={(e) => updateMetadata('brand_model', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Samsung Galaxy S23"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="purchase_repair"
                  value="purchase"
                  checked={formData.metadata.purchase_repair === 'purchase'}
                  onChange={(e) => updateMetadata('purchase_repair', e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Purchase</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="purchase_repair"
                  value="repair"
                  checked={formData.metadata.purchase_repair === 'repair'}
                  onChange={(e) => updateMetadata('purchase_repair', e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Repair</span>
              </label>
            </div>
          </>
        );

      case 'entertainment':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.metadata.entertainment_type || ''}
                onChange={(e) => updateMetadata('entertainment_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {ENTERTAINMENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue/Platform
              </label>
              <input
                type="text"
                value={formData.metadata.venue_platform || ''}
                onChange={(e) => updateMetadata('venue_platform', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., PVR Cinemas, Netflix"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                With Whom
              </label>
              <div className="flex gap-4">
                {['solo', 'friends', 'family'].map((whom) => (
                  <label key={whom} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="with_whom"
                      value={whom}
                      checked={formData.metadata.with_whom === whom}
                      onChange={(e) => updateMetadata('with_whom', e.target.value)}
                      className="w-4 h-4 text-teal-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{whom}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 'shopping_clothing':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Type
              </label>
              <input
                type="text"
                value={formData.metadata.clothing_type || ''}
                onChange={(e) => updateMetadata('clothing_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Shirt, Jeans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.metadata.brand || ''}
                onChange={(e) => updateMetadata('brand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Levis, H&M"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.metadata.color || ''}
                  onChange={(e) => updateMetadata('color', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g., Blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.metadata.size || ''}
                  onChange={(e) => updateMetadata('size', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g., M, 32"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Occasion
              </label>
              <input
                type="text"
                value={formData.metadata.occasion || ''}
                onChange={(e) => updateMetadata('occasion', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Casual, Formal"
              />
            </div>
          </>
        );

      case 'shopping_other':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Type
              </label>
              <select
                value={formData.metadata.shopping_type || ''}
                onChange={(e) => updateMetadata('shopping_type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select type</option>
                {SHOPPING_OTHER_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.metadata.item_name || ''}
                onChange={(e) => updateMetadata('item_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Running shoes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.metadata.brand || ''}
                onChange={(e) => updateMetadata('brand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g., Nike"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Expense</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      category: cat.id,
                      metadata: {},
                    });
                  }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData.category === cat.id
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {cat.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {cat.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {EXPENSE_CATEGORIES.find((c) => c.id === formData.category)?.name} Details
            </h3>
            <div className="space-y-4">{renderCategoryFields()}</div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Mode
              </label>
              <select
                value={formData.payment_mode}
                onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm p-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
